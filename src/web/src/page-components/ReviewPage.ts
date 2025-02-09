import { customElement, state } from "lit/decorators.js";
import { css, html, HTMLTemplateResult, LitElement } from "lit";
import { OrderItemService } from "../services/OrderItemService";
import { CartItem, OrderItem } from "@shared/types";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

@customElement("review-item-root")
export class ReviewPage extends LitElement {
    private _getOrderItem: OrderItemService = new OrderItemService();
    private _userService: UserService = new UserService();

    @state()
    private loggedIn: boolean = false;

    private orderItemData: OrderItem | null = null;
    private orderItemId: number | null = null;
    private userService: UserService = new UserService();

    @state()
    private loggedIn: boolean = false;

    public static styles = css`
        :host {
            display: block;
            padding: 16px;
            font-family: Arial, sans-serif;
        }
        .product {
            display: flex;
            float: left;
            flex-direction: column;
            align-items: center;
            max-width: 800px;
            margin: 0 auto;
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .product img {
            max-width: 100%;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        .product h3 {
            margin: 0 0 16px;
            font-size: 24px;
            color: #333;
        }
        .product p {
            font-size: 16px;
            color: #666;
            margin: 0 0 16px;
            text-align: center;
        }
        .buttons {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            align-items: center;
        }
        .base-price {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 16px;
        }
        .add-to-cart-button {
            padding: 12px 24px;
            font-size: 18px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .add-to-cart-button:hover {
            background-color: #0056b3;
        }
        .orderText {
            font-size: 14px;
            color: #333;
            margin-top: 16px;
            text-align: center;
        }
        .price-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 16px;
        }
        .old-price {
            font-size: 18px;
            color: #666;
            text-decoration: line-through;
            margin-bottom: 8px;
        }
        .discount {
            font-size: 18px;
            color: red;
            margin-bottom: 8px;
        }
        .delivery-info {
            font-size: 14px;
            color: green;
            margin-top: 8px;
            text-align: center;
        }
        .stock-status {
            font-size: 14px;
            color: green;
            margin-top: 8px;
            text-align: center;
        }
    `;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getUserInformation();

        this.orderItemId = this.getIdFromURL();

        if (this.orderItemId !== null) {
            void this.getGameItem();
        } else {
            console.error("No ID found in URL");
        }
    }

    public render(): HTMLTemplateResult {
        if (!this.orderItemData) {
            return html`<p>Loading...</p>`;
        }
        return this.renderGameItem(this.orderItemData);
    }

    private async getUserInformation(): Promise<void> {
        const user: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (user) {
            this.loggedIn = true;
        }
    }

    private getIdFromURL(): number | null {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get("id");
        return id ? Number(id) : null;
    }

    private async getGameItem(): Promise<void> {
        if (this.orderItemId === null) {
            console.error("No ID found in URL");
            return;
        }

        try {
            const result: OrderItem | undefined = await this._getOrderItem.getOneGame(this.orderItemId);
            if (result) {
                this.orderItemData = result;
                this.requestUpdate();
            } else {
                console.error("No game data found");
            }
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    }

    private renderGameItem(orderItem: OrderItem): HTMLTemplateResult {
        const imageURL: string = orderItem.imageURLs && orderItem.imageURLs.length > 0 ? orderItem.imageURLs[0] : "";
        const oldPrice: any = 2 * orderItem.price;
        return html`
            <div class="product">
                <h3>${orderItem.name}</h3>
                <img class="gameFoto" src="${imageURL}" alt="${orderItem.id}" />
                <p>${orderItem.description}</p>
                <div class="price-info">
                    <div class="old-price">€${oldPrice}</div>
                    <div class="discount">Super high discount!</div>
                    <div class="base-price">€${orderItem.price}</div>
                </div>
                <div class="delivery-info">delivery price is included, only with LucaStars</div>
                <div class="stock-status">in stock</div>
                <button
                        class="add-to-cart-button"
                        @click=${async (): Promise<void> => await this.addToCart(orderItem)}
                >
                    In cart
                </button>
                <div class="orderText">
                    ✓Collection from a LucaStars collection point possible<br />
                    ✓30 days' reflection period and free returns<br />
                    ✓Day and night customer service
                </div>
            </div>
        `;
    }

    private async addToCart(orderItem: OrderItem): Promise<void> {
        let cartItems: CartItem[] = [];

        if (this.loggedIn) {
            const result: CartItem[] | undefined = await this._userService.addOrderItemToCart(orderItem.id);

            if (result) {
                cartItems = result;
            }
        } else {
            try {
                cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
            } catch (error) {
                console.error("Error parsing cart items from localStorage", error);
            }

            const cartItem: CartItem | undefined = cartItems.find(
                (ci: CartItem) => ci.item.id === orderItem.id,
            );

            if (cartItem === undefined) {
                cartItems.push({
                    item: orderItem,
                    amount: 1,
                });
            } else {
                cartItem.amount++;
            }

            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
        this.dispatchCartUpdatedEvent(cartItems);
    }

    private dispatchCartUpdatedEvent(cartItems: CartItem[]): void {
        this.dispatchEvent(
            new CustomEvent("cart-updated", {
                detail: {
                    cartItems,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }
}

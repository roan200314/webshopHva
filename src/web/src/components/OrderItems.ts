import { LitElement, TemplateResult, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";
import { UserService } from "../services/UserService";
import { CartItem } from "@shared/types";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { AuthorizationLevel } from "../models/interfaces/AuthorizationLevel";

@customElement("order-itemsa")
export class OrderItemsComponent extends LitElement {
    public static styles = css`
        .product-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 20px 0;
        }

        .product {
            background-color: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .product img {
            width: 100%;
            height: auto;
        }

        .buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }

        .more-info-button,
        .add-to-cart-button {
            padding: 5px 10px;
            background-color: #f0c040;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 5px;
        }

        .base-price {
            font-weight: bold;
            color: #333;
        }

        .filter-option.selected {
            font-weight: bold;
            text-decoration: underline;
        }
    `;

    private _orderItemService: OrderItemService = new OrderItemService();
    private _userService: UserService = new UserService();

    @state()
    private employeeOrHigher: boolean = false;
    
    @property({ type: Array })
    public orderItems: OrderItem[] = [];

    @state()
    private _isPriceAscending: boolean = false;

    @state()
    private _isNameAscending: boolean = false;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getUserInformation();
        await this.getOrderItems();
        this.attachFilterListeners();
    }

    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        if (result) {
            this.orderItems = result;
        }
    }

    private attachFilterListeners(): void {
        const priceFilter:HTMLLIElement | null = document.querySelector("#price-filter");
        if (priceFilter) {
            priceFilter.addEventListener("click", () => this.toggleSortOrder("price"));
        }

        const nameFilter:HTMLLIElement | null = document.querySelector("#name-filter");
        if (nameFilter) {
            nameFilter.addEventListener("click", () => this.toggleSortOrder("name"));
        }
    }

    private toggleSortOrder(type: "price" | "name"): void {
        if (type === "price") {
            this._isPriceAscending = !this._isPriceAscending;
            this.sortByPrice();
        } else if (type === "name") {
            this._isNameAscending = !this._isNameAscending;
            this.sortByName();
        }
        this.updateFilterSelection(type);
    }

    private sortByPrice(): void {
        if (this._isPriceAscending) {
            this.orderItems = [...this.orderItems].sort((a, b) => a.price - b.price);
        } else {
            this.orderItems = [...this.orderItems].sort((a, b) => b.price - a.price);
        }
        this.requestUpdate();
    }

    private sortByName(): void {
        if (this._isNameAscending) {
            this.orderItems = [...this.orderItems].sort((a, b) => a.name.localeCompare(b.name));
        } else {
            this.orderItems = [...this.orderItems].sort((a, b) => b.name.localeCompare(a.name));
        }
        this.requestUpdate();
    }

    private updateFilterSelection(type: "price" | "name"): void {
        const filters:any = document.querySelectorAll(".filter-option a");
        filters.forEach((filter: HTMLLIElement) => filter.classList.remove("selected"));

        const selectedFilter:HTMLLIElement | null = document.querySelector(`#${type}-filter`);
        if (selectedFilter) {
            selectedFilter.classList.add("selected");
        }
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        const imageURL: string = orderItem.imageURLs && orderItem.imageURLs.length > 0
            ? orderItem.imageURLs[0]
            : "";

        const buttonLabel: string = orderItem.featured ? "Remove from Featured" : "Add to Featured";
        const newFeaturedState: boolean = !orderItem.featured;

        return html`
            <div class="product">
                <h3>${orderItem.name}</h3>
                <img src="${imageURL}" alt="${orderItem.name}" />
                <p>${orderItem.description}</p>
                <div class="buttons">
                    <span class="base-price">€ ${orderItem.price}</span>
                    <button class="add-to-cart-button"
                            @click=${async (): Promise<void> => await this.addToCart(orderItem)}
                    >In cart</button>
                    ${this.employeeOrHigher
                            ? html`<button class="addFeature"
                                           @click=${async (): Promise<void> => await this.setOrderItemAsFeatured(orderItem.id, newFeaturedState)}
                            >${buttonLabel}</button>`
                            : "" }
                </div>
            </div>
        `;
    }

    public render(): TemplateResult {
        return html`
            <section class="product-section" id="product-section">
                ${this.orderItems.map((orderItem: OrderItem) => this.renderOrderItem(orderItem))}
            </section>
        `;
    }

    private async addToCart(orderItem: OrderItem): Promise<void> {
        const result: CartItem[] | undefined = await this._userService.addOrderItemToCart(orderItem.id);

        if (result) {
            this.dispatchEvent(
                new CustomEvent("cart-updated", {
                    detail: {
                        cartItems: result,
                    },
                    bubbles: true,
                    composed: true
                })
            );
        }
    }

    private async getUserInformation(): Promise<void> {
        const userInformation: UserHelloResponse | undefined = await this._userService.getWelcome();
        if (!userInformation || !userInformation.user) return;
        if (!userInformation.user.authorizationLevel) return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (userInformation.user.authorizationLevel === AuthorizationLevel.EMPLOYEE || userInformation.user.authorizationLevel === AuthorizationLevel.ADMIN) {
            this.employeeOrHigher = true;
        }
    }

    private async setOrderItemAsFeatured(id: number, setFeatured: boolean): Promise<void> {
        await this._orderItemService.setOrderAsFeatured(id, setFeatured);
        await this.getOrderItems();
    }
}

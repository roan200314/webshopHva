import { customElement, state } from "lit/decorators.js";
import { html, LitElement, TemplateResult, css } from "lit";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";

@customElement("index-page")
export class IndexPage extends LitElement {
    
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
        .wrapper {
            width: 80%;
            margin: 0 auto;
        }
        .title {
            text-align: center;
        }
    `;

    private _orderItemService: OrderItemService = new OrderItemService();

    @state()
    private orderItems: OrderItem[] = [];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getOrderItems();
    }

    public render(): TemplateResult {
        return html`
            <h1 class="title">Welcome to the Index Page</h1>
            ${this.orderItems.length > 0
                ? html`
                <div class="wrapper">
                    <section class="product-section" id="product-section">
                        ${this.orderItems.map((orderItem: OrderItem) => this.renderOrderItem(orderItem))}
                    </section>
                </div>
                `
                : html`<p>Loading items...</p>`
            }
        `;
    }

    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        if (result) {
            this.orderItems = result;
        } else {
            console.error("Failed to fetch order items");
        }
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        const imageURL: string = orderItem.imageURLs && orderItem.imageURLs.length > 0 ? orderItem.imageURLs[0] : "";
        const shorterText: any = orderItem.description?.length > 150 ? orderItem.description?.substring(0, 150) + "..." : orderItem.description;
        return html`
            <div class="product">
                <h3>${orderItem.name}</h3>
                <img src="${imageURL}" alt="${orderItem.name}" />
                <p>${shorterText}</p>
                <div class="buttons">
                    <span class="base-price">€ ${orderItem.price}</span>
                    <button class="add-to-cart-button">In cart</button>
                </div>
            </div>
        `;
    }
}

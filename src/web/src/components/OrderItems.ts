import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";

@customElement("order-items")
export class OrderItems extends LitElement {
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
    `;

    private _orderItemService: OrderItemService = new OrderItemService();

    @property({ type: Array })
    public orderItems: OrderItem[] = [];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getOrderItems();
    }

    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        if (result) {
            this.orderItems = result;
        } else {
          return;
        }
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        const imageURL:string = orderItem.imageURLs && orderItem.imageURLs.length > 0 ? orderItem.imageURLs[0] : "";

        return html`
            <div class="product">
                <h3>${orderItem.name}</h3>
                <img src="${imageURL}" alt="${orderItem.name}">
                <p>${orderItem.description}</p>
                <div class="buttons">
                    <span class="base-price">€ ${orderItem.price}</span>
                    <button class="add-to-cart-button">In cart</button>
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
}

import { LitElement, html, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";

@customElement("order-items")
export class OrderItems extends LitElement {

    private _orderItemService: OrderItemService = new OrderItemService();
    
    @state()
    private _orderItems: OrderItem[] = [];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("OrderItemComponent connected");
        
        await this.getOrderItems();
        this.render();
    }

    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        console.log(result);
        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        return html`
        <div class="product">
          <img src=".${orderItem.imageURLs}" alt="${orderItem.name}"> <!-- Image url will prob need . removed -->
          <div class="buttons">
            <button class="more-info-button">More info</button>
            <span class="base-price">${orderItem.price}</span>
            <button class="add-to-cart-button">In cart</button>
          </div>
        </div>
        `;
    }

    public render(): TemplateResult {
        return html`
            <div>
                ${this._orderItems.map((orderItem: OrderItem) => this.renderOrderItem(orderItem))}
            </div>
        `;
    }
}

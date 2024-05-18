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
            <div class="order-item">
                <h2 id="name${orderItem.id}">${orderItem.name}</h2>
                <p id="description${orderItem.id}">${orderItem.description}</p>
                <p id="price${orderItem.id}">€${orderItem.price}</p>
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

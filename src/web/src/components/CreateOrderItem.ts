import { LitElement, TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";

@customElement("create-order-item")
export class CreateOrderItem extends LitElement {
    @state()
    private orderItem: OrderItem = {
        id: 0,
        name: "",
        price: 0,
        description: "",
        imageURLs: [],
    };
    public render(): TemplateResult {
        return html`
            <form @submit=${this.createOrderItem}>
                <label for="name">Name</label>
                <input type="text" id="name" name="name" @input=${this.updateName} required/>
                <label for="price">Price</label>
                <input type="number" id="price" name="price" @input=${this.updatePrice} required>
                <label for="description">Description</label>
                <textarea id="description" name="description"></textarea>
                <button type="submit">Create</button>
            </form>
        `;
    }

    private updateName(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.name = input.value;
    }

    private updatePrice(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.price = parseFloat(input.value);
    }

    private async createOrderItem(event: Event): Promise<void> {
        event.preventDefault();
        const response: Response = await fetch("/api/orderItems/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.orderItem),
        });

        if (response.ok) {
            this.orderItem = {
                id: 0,
                name: "",
                price: 0,
                description: "",
                imageURLs: [],
            };
        }
    }
}
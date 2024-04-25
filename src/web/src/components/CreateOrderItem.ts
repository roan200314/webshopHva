import { LitElement, TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("create-order-item")
export class CreateOrderItem extends LitElement {
    @state()
    private orderItem: any = {
        name: "",
        price: 0,
        description: "",
    };
    public render(): TemplateResult {
        return html`
            <form @submit=${this.createOrderItem}>
                <label for="name">Name</label>
                <input type="text" id="name" name="name" @input=${this.updateName} required/>
                <label for="price">Price</label>
                <input type="number" id="price" name="price" @input=${this.updatePrice} required>
                <label for="description">Description</label>
                <textarea id="description" name="description" @input=${this.updateDescription} required></textarea>
                <button type="submit">Create</button>
            </form>
        `;
    }
    /**
     * Updates the name of the order item.
     * @param event 
     */
    private updateName(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.name = input.value;
    }

    /**
     * Updates the price of the order item.
     * @param event 
     */
    private updatePrice(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.price = parseFloat(input.value);
    }

    /**
     * Updates the description of the order item.
     * @param event 
     */
    private updateDescription(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.description = input.value;
    }

    /**
     * Creates an order item.
     * @param event 
     */
    private async createOrderItem(event: Event): Promise<void> {
        event.preventDefault();
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.orderItem),
        });
        if (!response.ok) {
            console.error(response);
        }
        alert("Order item created successfully");
    }
}
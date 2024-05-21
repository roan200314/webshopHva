import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";

@customElement("order-item-search")
export class OrderItemSearch extends LitElement {

    public static styles = css`
        .search-item-bar {
            padding: 10px;
            font-size: 1em;
            width: 90%;
        }
    
    `;

    @state()
    private _foundOrderItems: OrderItem[] = [];

    public render(): TemplateResult {
        return html`
            <form @submit=${this.searchOrderItemByName}>
                <input type="text" class="search-item-bar" placeholder="Search for an item by name" />  
            </form>`;
    }

    private async searchOrderItemByName(event: Event): Promise<void> {
        event.preventDefault();
        const nameInput: HTMLInputElement | null = this.shadowRoot?.querySelector(".search-item-bar") || null;
        if (nameInput) {
            const name: string = nameInput.value;
            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/search/${name}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const orderItems: OrderItem[] = await response.json();
                this._foundOrderItems = orderItems;
                console.log("Found Order Items:", this._foundOrderItems);
            } else {
                alert("Could not get order items");
                this._foundOrderItems = [];
            }
        }
    }
}

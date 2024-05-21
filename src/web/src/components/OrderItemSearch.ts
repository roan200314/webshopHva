import { LitElement, html, TemplateResult, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("order-item-search")
export class OrderItemSearch extends LitElement {

    public static styles = css`
        .search-item-bar {
            padding: 10px;
            font-size: 1em;
            width: 100%;
        }
    `;

    public render(): TemplateResult {
        return html`
            <form @submit=${this.searchOrderItemByName}>
                <input type="text" class="search-item-bar" placeholder="Search for an item by name" />  
            </form>
        `;
    }

    private async searchOrderItemByName(event: Event): Promise<void> {
        event.preventDefault();
        const nameInput: HTMLInputElement | null = this.shadowRoot?.querySelector(".search-item-bar") || null;
        if (nameInput) {
            console.log("searching for order item by name");
            const name: string | null = nameInput.value || null;
            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/search/${name}`, {
                method: "GET",
                headers: {
                },
            });
            
            if (!response.ok) {
                alert("Could not get order item");
            } else {
                alert("Order item retrieved successfully");
            }
        }
    }
}

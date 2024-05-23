import { LitElement, html, TemplateResult, css } from "lit";
import { customElement } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";

@customElement("order-item-search")
export class OrderItemSearchComponent extends LitElement {
    public static styles = css`
        .search-item-bar {
            padding: 10px;
            font-size: 1em;
            width: 90%;
        }
    `;

    private _orderItemService: OrderItemService = new OrderItemService();
    /**
     *
     * @returns {TemplateResult}
     * Renders the search bar for order items
     */
    public render(): TemplateResult {
        return html`
            <form @submit=${this.searchOrderItemByName}>
                <input type="text" class="search-item-bar" placeholder="Search for an item by name" />
            </form>
        `;
    }
    /**
     * Retrieves all order items
     */
    private async getAllOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        if (result) {
            const orderItemsElement: any = document.querySelector("order-items");
            if (orderItemsElement) {
                orderItemsElement.orderItems = result;
            }
        } else {
            alert("Could not fetch all order items");
        }
    }
    /**
     *
     * @param event
     * Searches for an order item by name and displays the result
     */
    private async searchOrderItemByName(event: Event): Promise<void> {
        event.preventDefault();
        const nameInput: HTMLInputElement | null = this.shadowRoot?.querySelector(".search-item-bar") || null;
        if (nameInput) {
            const name: string = nameInput.value.trim();
            if (name === "") {
                // If the search input is empty, fetch all order items
                await this.getAllOrderItems();
                return;
            }

            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/search/${name}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const orderItems: OrderItem[] = await response.json();
                const orderItemsElement: any = document.querySelector("order-items");
                if (orderItemsElement) {
                    orderItemsElement.orderItems = orderItems;
                }
            } else {
                alert("Could not get order items");
            }
        }
    }
}

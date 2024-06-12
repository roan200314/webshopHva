import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";

@customElement("order-item-search")
export class OrderItemSearchComponent extends LitElement {
    public static styles = css`
        .search-item-bar {
            padding: 10px;
            font-size: 1em;
            width: 70%;
        }

        #search-result-wrap {
            display: flex;
            align-items: center;
        }
        .no-results {
            color:red;
        }
    `;

    private _orderItemService: OrderItemService = new OrderItemService();

    @state()
    private _search: string = "";

    @state()
    private _noResults: boolean = false;

    private _timer: number | undefined;

    private handleInputChange(event: Event): void {
        const input: HTMLInputElement | null = event.target as HTMLInputElement;
        if (input) {
            this._search = input.value.trim();
            if (this._timer) {
                clearTimeout(this._timer);
            }
            this._timer = window.setTimeout(() => {
                void this.searchOrderItemByName();
            }, 100);
        }
    }

    /**
     *
     * @returns {TemplateResult}
     * Renders the search bar for order items
     */
    public render(): TemplateResult {
        return html`
            <form @submit=${this.handleFormSubmit}>
                <input
                    type="text"
                    class="search-item-bar"
                    placeholder="Search for an item by name"
                    @input=${this.handleInputChange}
                />
            </form>
            <div id="search-result-wrap">Search results: &nbsp
                <p id=search_result class="${this._noResults ? "no-results" : ""}"></p>${this._search}</p>
            </div>
        `;
    }
    /**
     * 
     * @param event 
     * Prevents the form from submitting
     */
    private handleFormSubmit(event: Event): void {
        event.preventDefault(); 
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
     * Searches for an order item by name and displays the result
     */
    private async searchOrderItemByName(): Promise<void> {
        if (this._search === "") {
            // If the search input is empty, fetch all order items
            await this.getAllOrderItems();
            return;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/search/${this._search}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const orderItems: OrderItem[] = await response.json();
            if (orderItems.length === 0) {
                this._search = "No results found";
                this._noResults = true;
                return;
            }
            const orderItemsElement: any = document.querySelector("order-items");
            if (orderItemsElement) {
                this._noResults = false;
                orderItemsElement.orderItems = orderItems;
            }
        } else {
            alert("Could not get products");
        }
    }
}

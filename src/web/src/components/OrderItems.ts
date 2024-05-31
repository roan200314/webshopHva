import { LitElement, TemplateResult, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";
import { UserService } from "../services/UserService";
import { CartItem } from "@shared/types";

@customElement("order-items")
export class OrderItemsComponent extends LitElement {
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

        .filter-option.selected {
            font-weight: bold;
            text-decoration: underline;
        }

        .slider-container {
            margin: 20px 0;
            text-align: center;
        }

        .slider {
            width: 80%;
            margin: auto;
        }
    `;

    private _orderItemService: OrderItemService = new OrderItemService();
    private _userService: UserService = new UserService();

    @property({ type: Array })
    public orderItems: OrderItem[] = [];

    @state()
    private _isPriceAscending: boolean = false;

    @state()
    private _isNameAscending: boolean = false;

    @state()
    private _priceRange: { min: number, max: number } = { min: 0, max: 1000 };

    @state()
    private _filteredOrderItems: OrderItem[] = [];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getOrderItems();
        this.attachFilterListeners();
    }

    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        if (result) {
            this.orderItems = result;
            this._filteredOrderItems = result;
        }
    }

    private attachFilterListeners(): void {
        const priceFilter: HTMLLIElement | null = document.querySelector("#price-filter");
        if (priceFilter) {
            priceFilter.addEventListener("click", () => this.toggleSortOrder("price"));
        }

        const nameFilter: HTMLLIElement | null = document.querySelector("#name-filter");
        if (nameFilter) {
            nameFilter.addEventListener("click", () => this.toggleSortOrder("name"));
        }
    }

    private toggleSortOrder(type: "price" | "name"): void {
        if (type === "price") {
            this._isPriceAscending = !this._isPriceAscending;
            this.sortByPrice();
        } else if (type === "name") {
            this._isNameAscending = !this._isNameAscending;
            this.sortByName();
        }
        this.updateFilterSelection(type);
    }

    private sortByPrice(): void {
        if (this._isPriceAscending) {
            this._filteredOrderItems = [...this._filteredOrderItems].sort((a, b) => a.price - b.price);
        } else {
            this._filteredOrderItems = [...this._filteredOrderItems].sort((a, b) => b.price - a.price);
        }
        this.requestUpdate();
    }

    private sortByName(): void {
        if (this._isNameAscending) {
            this._filteredOrderItems = [...this._filteredOrderItems].sort((a, b) => a.name.localeCompare(b.name));
        } else {
            this._filteredOrderItems = [...this._filteredOrderItems].sort((a, b) => b.name.localeCompare(a.name));
        }
        this.requestUpdate();
    }

    private updateFilterSelection(type: "price" | "name"): void {
        const filters: any = document.querySelectorAll(".filter-option a");
        filters.forEach((filter: HTMLLIElement) => filter.classList.remove("selected"));

        const selectedFilter: HTMLLIElement | null = document.querySelector(`#${type}-filter`);
        if (selectedFilter) {
            selectedFilter.classList.add("selected");
        }
    }

    private handleSliderChange(event: Event): void {
        const target:any = event.target as HTMLInputElement;
        const value:any = Number(target.value);
        this._priceRange = { ...this._priceRange, [target.name]: value };
        this.filterByPriceRange();
    }

    private filterByPriceRange(): void {
        this._filteredOrderItems = this.orderItems.filter(item =>
            item.price >= this._priceRange.min && item.price <= this._priceRange.max
        );
        this.requestUpdate();
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        const imageURL: string =
            orderItem.imageURLs && orderItem.imageURLs.length > 0 ? orderItem.imageURLs[0] : "";

        return html`
            <div class="product">
                <h3>${orderItem.name}</h3>
                <img src="${imageURL}" alt="${orderItem.name}" />
                <p>${orderItem.description}</p>
                <div class="buttons">
                    <span class="base-price">€ ${orderItem.price}</span>
                    <button class="add-to-cart-button" @click=${async (): Promise<void> => await this.addToCart(orderItem)}>In cart</button>
                </div>
            </div>
        `;
    }

    public render(): TemplateResult {
        return html`
            <div class="slider-container">
                <label for="min-price">Min Price: €${this._priceRange.min}</label>
                <input class="slider" type="range" id="min-price" name="min" min="0" max="1000" .value="${String(this._priceRange.min)}" @input="${this.handleSliderChange}" />
            </div>
            <section class="product-section" id="product-section">
                ${this._filteredOrderItems.map((orderItem: OrderItem) => this.renderOrderItem(orderItem))}
            </section>
        `;
    }

    private async addToCart(orderItem: OrderItem): Promise<void> {
        const result: CartItem[] | undefined = await this._userService.addOrderItemToCart(orderItem.id);

        if (result) {
            this.dispatchEvent(
                new CustomEvent("cart-updated", {
                    detail: {
                        cartItems: result,
                    },
                    bubbles: true,
                    composed: true
                })
            );
        }
    }
}

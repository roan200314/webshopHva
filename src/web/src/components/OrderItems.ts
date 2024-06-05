import { LitElement, TemplateResult, html, css, PropertyValues } from "lit";
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
            position: relative;
            height: 5px;
            background-color: #ddd;
        }

        .slider-handle {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #f0c040;
            border-radius: 50%;
            cursor: pointer;
            top: -7.5px;
            z-index: 2;
        }

        .slider-range {
            position: absolute;
            height: 100%;
            background-color: #f0c040;
            z-index: 1;
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
    private _sliderMin: number = 0; // Needs to be changed to the minimum price of the order items

    @state()
    private _sliderMax: number = 1000; // Needs to be changed to the maximum price of the order items

    private _minHandle: HTMLElement | null = null;
    private _maxHandle: HTMLElement | null = null;
    private _sliderRange: HTMLElement | null = null;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getOrderItems();
        this.attachFilterListeners();
    }

    private handleSliderChange(): void {
        const min: number = parseFloat(this._minHandle?.style.left || "0");
        const max: number = parseFloat(this._maxHandle?.style.left || "100");
        this._priceRange = { min: Math.round(min * 10), max: Math.round(max * 10) };
        this.filterByPriceRange();
    }

    private filterByPriceRange(): void {
        this.orderItems = this.orderItems.filter(item =>
            item.price >= this._priceRange.min && item.price <= this._priceRange.max
        );
        this.requestUpdate();
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this._minHandle = this.shadowRoot?.getElementById("min-handle") as HTMLElement | null;
        this._maxHandle = this.shadowRoot?.getElementById("max-handle") as HTMLElement | null;
        this._sliderRange = this.shadowRoot?.getElementById("slider-range") as HTMLElement | null;

        this._minHandle?.addEventListener("mousedown", this.handleDragStart.bind(this, "min"));
        this._maxHandle?.addEventListener("mousedown", this.handleDragStart.bind(this, "max"));
    }

    private handleDragStart(handleType: "min" | "max", event: MouseEvent): void {
        event.preventDefault();

        const handleMouseMove: any = (moveEvent: MouseEvent): void => {
            const sliderRect: DOMRect = (this.shadowRoot?.querySelector(".slider") as HTMLElement).getBoundingClientRect();
            let newPosition: number = (moveEvent.clientX - sliderRect.left) / sliderRect.width * 100;

            if (handleType === "min") {
                newPosition = Math.min(newPosition, parseFloat(this._maxHandle?.style.left || "100") - 5);
                newPosition = Math.max(newPosition, 0);
                this._minHandle!.style.left = `${newPosition}%`;
            } else {
                newPosition = Math.max(newPosition, parseFloat(this._minHandle?.style.left || "0") + 5);
                newPosition = Math.min(newPosition, 100);
                this._maxHandle!.style.left = `${newPosition}%`;
            }

            this._sliderRange!.style.left = `${this._minHandle?.style.left}`;
            this._sliderRange!.style.right = `${100 - parseFloat(this._maxHandle?.style.left || "100")}%`;

            this.handleSliderChange();
        };

        const handleMouseUp: any = (): void => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }


    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        if (result) {
            this.orderItems = result;
        }
    }

    private attachFilterListeners(): void {
        const priceFilter:HTMLLIElement | null = document.querySelector("#price-filter");
        if (priceFilter) {
            priceFilter.addEventListener("click", () => this.toggleSortOrder("price"));
        }

        const nameFilter:HTMLLIElement | null = document.querySelector("#name-filter");
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
            this.orderItems = [...this.orderItems].sort((a, b) => a.price - b.price);
        } else {
            this.orderItems = [...this.orderItems].sort((a, b) => b.price - a.price);
        }
        this.requestUpdate();
    }

    private sortByName(): void {
        if (this._isNameAscending) {
            this.orderItems = [...this.orderItems].sort((a, b) => a.name.localeCompare(b.name));
        } else {
            this.orderItems = [...this.orderItems].sort((a, b) => b.name.localeCompare(a.name));
        }
        this.requestUpdate();
    }

    private updateFilterSelection(type: "price" | "name"): void {
        const filters:any = document.querySelectorAll(".filter-option a");
        filters.forEach((filter: HTMLLIElement) => filter.classList.remove("selected"));

        const selectedFilter:HTMLLIElement | null = document.querySelector(`#${type}-filter`);
        if (selectedFilter) {
            selectedFilter.classList.add("selected");
        }
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
                <div class="slider">
                    <div id="min-handle" class="slider-handle" style="left: 0;"></div>
                    <div id="max-handle" class="slider-handle" style="left: 100%;"></div>
                    <div id="slider-range" class="slider-range" style="left: 0%; right: 0%;"></div>
                </div>
                <label for="min-price">Min Price: €${this._priceRange.min}</label>
                <label for="max-price">Max Price: €${this._priceRange.max}</label>
            </div>

            <section class="product-section" id="product-section">
                ${this.orderItems.map((orderItem: OrderItem) => this.renderOrderItem(orderItem))}
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

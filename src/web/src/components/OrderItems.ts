import { LitElement, TemplateResult, html, css, PropertyValues } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";
import { CartItem } from "@shared/types";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { AuthorizationLevel } from "../models/interfaces/AuthorizationLevel";
import { UserService } from "../services/UserService";

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
            width: 50%;
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

    @state()
    private loggedIn: boolean = false;

    @state()
    private employeeOrHigher: boolean = false;
    
    @property({ type: Array })
    public orderItems: OrderItem[] = [];

    @property({ type: Array })
    public unfilteredOrderItems: OrderItem[] = [];

    @state()
    private _isPriceAscending: boolean = false;

    @state()
    private _isNameAscending: boolean = false;

    @state()
    private _priceRange: { min: number, max: number } = { min: 0, max: 1000 };

    @state()
    private _sliderMin: number = 0; 

    @state()
    private _sliderMax: number = 1000; 

    private _minHandle: HTMLElement | null = null;
    private _maxHandle: HTMLElement | null = null;
    private _sliderRange: HTMLElement | null = null;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getUserInformation();
        await this.getOrderItems();
        this.attachFilterListeners();
    }

    private handleSliderChange(): void {
        const min: number = parseFloat(this._minHandle?.style.left || "0");
        const max: number = parseFloat(this._maxHandle?.style.left || "100");
        this._priceRange = { min: Math.round(min * (this._sliderMax - this._sliderMin) / 100 + this._sliderMin), max: Math.round(max * (this._sliderMax - this._sliderMin) / 100 + this._sliderMin) };
        this.filterByPriceRange();
    }

    private filterByPriceRange(): void {
        this.orderItems = this.unfilteredOrderItems.filter(item =>
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
            this.unfilteredOrderItems = result;
            this.orderItems = result;
            
            // Calculate the minimum and maximum prices
            const prices: number[] = result.map(item => item.price);
            this._sliderMin = Math.min(...prices);
            this._sliderMax = Math.max(...prices);
            this._priceRange = { min: this._sliderMin, max: this._sliderMax };
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

        const checkbox: HTMLInputElement | null = document.querySelector("#merchandise-filter");
        if (checkbox) {
            checkbox.addEventListener("change", () => this.filterByType());
        }

        const checkbox2: HTMLInputElement | null = document.querySelector("#game-filter");
        if (checkbox2) {
            checkbox2.addEventListener("change", () => this.filterByType());
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
        const imageURL: string = orderItem.imageURLs && orderItem.imageURLs.length > 0
            ? orderItem.imageURLs[0]
            : "";

        const buttonLabel: string = orderItem.featured ? "Remove from Featured" : "Add to Featured";
        const newFeaturedState: boolean = !orderItem.featured;

        return html`
            <div class="product">
                <h3>${orderItem.name}</h3>
                <img src="${imageURL}" alt="${orderItem.name}" />
                <p>${orderItem.description}</p>
                <div class="buttons">
                    <span class="base-price">€ ${orderItem.price}</span>
                    <button class="add-to-cart-button"
                            @click=${async (): Promise<void> => await this.addToCart(orderItem)}
                    >In cart</button>
                    ${this.employeeOrHigher
                            ? html`<button class="addFeature"
                                           @click=${async (): Promise<void> => await this.setOrderItemAsFeatured(orderItem.id, newFeaturedState)}
                            >${buttonLabel}</button>`
                            : "" }
                </div>
            </div>
        `;
    }

    public render(): TemplateResult {
        const sidebar: HTMLElement | null = document.querySelector(".sidebar");
        const slider: any = html`
            <div class="slider-container">
                <div class="slider">
                    <div id="min-handle" class="slider-handle" style="left: 0;"></div>
                    <div id="max-handle" class="slider-handle" style="left: 100%;"></div>
                    <div id="slider-range" class="slider-range" style="left: 0%; right: 0%;"></div>
                </div>
                <label for="min-price">Min Price: €${this._priceRange.min}</label>
                <label for="max-price">Max Price: €${this._priceRange.max}</label>
            </div>`;
        if (sidebar) {
        }
        return html`
            ${slider}
            <section class="product-section" id="product-section">
                ${this.orderItems.map((orderItem: OrderItem) => this.renderOrderItem(orderItem))}
            </section>
        `;
    }


    private async addToCart(orderItem: OrderItem): Promise<void> {
        let cartItems: CartItem[] = [];

        if (this.loggedIn) {
            const result: CartItem[] | undefined = await this._userService.addOrderItemToCart(orderItem.id);

            if (result) {
                cartItems = result;
            }
        }
        else {
            try {
                cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
            } catch (error) {
                console.error("Error parsing cart items from localStorage", error);
            }

            const cartItem: CartItem | undefined = cartItems.find((ci: CartItem) => ci.item.id === orderItem.id);

            if(cartItem === undefined) {
                cartItems.push({
                    item: orderItem,
                    amount: 1
                });
            } else {
                cartItem.amount++;
            }

            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
        this.dispatchCartUpdatedEvent(cartItems);
    }

    private dispatchCartUpdatedEvent(cartItems: CartItem[]): void {
        this.dispatchEvent(
            new CustomEvent("cart-updated", {
                detail: {
                    cartItems,
                },
                bubbles: true,
                composed: true
            })
        );
    }

    private async getUserInformation(): Promise<void> {
        const userInformation: UserHelloResponse | undefined = await this._userService.getWelcome();
        if (!userInformation || !userInformation.user) return;

        this.loggedIn = true;

        if (!userInformation.user.authorizationLevel) return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (userInformation.user.authorizationLevel === AuthorizationLevel.EMPLOYEE || userInformation.user.authorizationLevel === AuthorizationLevel.ADMIN) {
            this.employeeOrHigher = true;
        }
    }

    private async getMerchandiseItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getMerchandiseItems();
        if (result) {
            this.orderItems = result;
        }
    }

    private async getGameItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getGameItems();
        if (result) {
            this.orderItems = result;
        }
    }

    private async filterByType(): Promise<void>{
        const merchandisecheckbox: HTMLInputElement | null = document.querySelector("#merchandise-filter");
        const gamecheckbox: HTMLInputElement | null = document.querySelector("#game-filter");
        if (merchandisecheckbox && gamecheckbox) {
            if (merchandisecheckbox.checked) {
                await this.getMerchandiseItems();
            } else if (gamecheckbox.checked) {
                await this.getGameItems();
            } else {
                return;
            }
        }
        return;
    }

    private async setOrderItemAsFeatured(id: number, setFeatured: boolean): Promise<void> {
        await this._orderItemService.setOrderAsFeatured(id, setFeatured);
        await this.getOrderItems();
    }
}

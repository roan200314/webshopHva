import { customElement, state } from "lit/decorators.js";
import { css, html, HTMLTemplateResult, LitElement, TemplateResult } from "lit";
import { Address, CartItem, UserData } from "@shared/types";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { AddressService } from "../services/AddressService";
import { OrderItemService } from "../services/OrderItemService";

@customElement("shopping-cart-page")
export class ShoppingCartPage extends LitElement {
    public static styles = css`
        header {
            background-color: #fbfbfa;
            padding: 10px;
        }

        main {
            padding: 10px;
        }

        footer {
            background-color: #ecae20;
            padding: 10px;
            text-align: center;
            position: fixed;
            z-index: 100;
            bottom: 0;
            left: 0;
            width: 100%;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        nav .logo img {
            width: auto;
            height: 100px;
            cursor: pointer;
        }

        .order-item {
            box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
            width: 350px;
            text-align: center;
        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form label {
            display: block;
            margin-bottom: 5px;
        }

        h2 {
            text-align: center;
            color: #4b515d;
        }

        table,
        th,
        td {
            border: 2px solid #4b515d;
            border-collapse: collapse;
        }

        table {
            border-spacing: 30px;
            width: 50%;
            margin: auto;
            justify-content: center;
        }

        th {
            font-size: 1.2em;
            font-weight: bolder;
            padding: 10px;
            background-color: #4b515d;
            color: white;
        }

        td {
            padding: 10px;
        }

        .title {
            color: #ecae20;
            text-align: center;
            margin: 3%;
        }

        #steps {
            text-align: right;
            margin-right: 25%;
            padding: 10px;
        }

        .stepnmbr {
            border: 2px solid #4b515d;
            display: inline;
            padding: 10px;
        }

        #currentstep {
            background-color: #4b515d;
            color: white;
        }

        .nxtstep {
            text-align: right;
            margin-right: 400px;
            margin-top: 25px;
        }

        .button {
            background-color: #373e98;
            color: white;
            border-radius: 10px;
            padding: 10px;
            border: none;
        }

        .adressInfo {
            border: 2px solid #4b515d;
            width: 50%;
            margin: auto;
            text-align: right;
            font-weight: bolder;
        }

        .adressInfo input {
            margin: 10px;
            margin-right: 35%;
        }

        #userInfo {
            text-align: center;
        }

        .delete {
            background-color: #f56d6d;
            border: none;
            border-radius: 5px;
            padding: 5px;
        }

        .delete:hover {
            cursor: pointer;
        }

        .edit:hover {
            cursor: pointer;
        }

        .infochoice {
            border: 2px solid #4b515d;
            text-align: center;
            width: 50%;
            margin-left: 25%;
        }

        #total {
            text-align: right;
        }

        .infotxt {
            color: white;
            background-color: #4b515d;
            padding: 8px;
            margin-top: 0;
            margin-bottom: 0;
        }

        #points {
            text-align: center;
        }

        p {
            margin-top: 0;
        }

        #discountOption {
            margin-bottom: 10px;
        }
    `;

    @state()
    public _usedPoints: number | undefined;
    @state()
    public _cartItemsCount: number | undefined;
    @state()
    private shoppingCartStep: number = 1;
    @state()
    private cartItems: CartItem[] = [];
    @state()
    private _isLoggedIn: boolean = false;
    @state()
    private _user: UserData = {
        id: 0,
        name: "",
        email: "",
    };
    private _adressData: Address = {
        id: 0,
        street: "",
        city: "",
        zip: "",
        country: "",
        user: this._user,
    };
    private userService: UserService = new UserService();
    private _addressService: AddressService = new AddressService();
    private _orderService: OrderItemService = new OrderItemService();
    private _email: string = "";
    private _name: string = "";

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        this.render();
        await this.getWelcome();
        await this.getAddress();

        this.getCartItems();

        window.addEventListener("cart-update", (): void => {
            void ((): void => {
                this.getCartItems();
            })();
        });
    }

    public render(): TemplateResult {
        if (this.cartItems.length === 0) {
            return html` <h1 class="title">Your shopping cart is empty!</h1> `;
        }

        if (this.shoppingCartStep === 1) {
            return this.renderShoppingCart();
        } else if (this.shoppingCartStep === 2) {
            return this._renderUserConfirmation();
        } else if (this.shoppingCartStep === 3) {
            return this._renderInfoConfirmation();
        } else if (this.shoppingCartStep === 4) {
            return this._renderOrderConfirmation();
        }

        return html``;
    }

    private async getAddress(): Promise<void> {
        const result: Address | undefined = await this._addressService.getAddressForUser();

        if (!result) {
            return;
        }

        this._adressData = result;
    }

    /**
     * Check if the current token is valid and update the cart item total
     */
    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this.userService.getWelcome();

        if (result) {
            this._user = result.user;
            this._user.savedPoints = result.savedPoints;
            this.cartItems = result.cartItems ? result.cartItems : [];
            this._email = result.user.email;
            this._name = result.user.name;
            this._isLoggedIn = true;
        }
    }

    private getCartItems(): void {
        if (this._isLoggedIn) return;

        const result: string | null = localStorage.getItem("cart");

        if (result) {
            this.cartItems = JSON.parse(result);
            this._cartItemsCount = this.cartItems.length;
        }
    }

    private renderShoppingCart(): TemplateResult {
        const totalAmount: number = this.calculateTotalPrice();

        return html`
            <h1 class="title">Just a few steps left to go!</h1>
            <div id="steps">
                <div class="stepnmbr" id="currentstep" @click="${(): void => this.updateStep(1)}">Step 1</div>
                <div class="stepnmbr" @click="${(): void => this.updateStep(3)}">Step 2</div>
                <div class="stepnmbr" @click="${(): void => this.updateStep(4)}">Step 3</div>
            </div>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
                ${this.cartItems.map((cartItem) => {
                    return html`
                        <tr>
                            <td>${cartItem.item.name}</td>
                            <td>
                                <input
                                    type="number"
                                    value=${cartItem.amount}
                                    @change="${async (e: Event): Promise<void> =>
                                        await this._changeCartAmount(e, cartItem)}"
                                />
                            </td>
                            <td>${cartItem.item.price}</td>
                            <td>
                                <b
                                    >&euro;${(
                                        Math.round(cartItem.item.price * cartItem.amount * 100) / 100
                                    ).toFixed(2)}</b
                                >
                            </td>
                            <td>
                                <button
                                    class="delete"
                                    @click="${async (): Promise<void> => await this._deleteCart(cartItem)}"
                                >
                                    <img src="/assets/img/bin.png" alt="delete" width="20" height="20" />
                                </button>
                            </td>
                        </tr>
                    `;
                })}
            </table>
            <div class="nxtstep">
                <h2 id="total">Your total is: &euro; ${totalAmount.toFixed(2)}</h2>
                <button class="button" type="submit" @click="${(): number => (this.shoppingCartStep = 2)}">
                    Next Step
                </button>
            </div>
        `;
    }

    private async _changeCartAmount(e: Event, cartItem: CartItem): Promise<void> {
        const newAmount: number = Number.parseInt((e.target as HTMLInputElement).value);

        if (this._isLoggedIn) {
            const result: CartItem[] | undefined = await this.userService.setCartItemAmount(
                cartItem.item.id,
                newAmount,
            );
            if (result) {
                this.cartItems = result;
                this._cartItemsCount = this.cartItems.length;
            }
        } else {
            // Remove previous
            const index: number = this.cartItems.indexOf(cartItem);
            this.cartItems[index].amount = newAmount;
            localStorage.setItem("cart", JSON.stringify(this.cartItems));
        }

        this.requestUpdate();
    }

    private async _deleteCart(cartItem: CartItem): Promise<void> {
        if (this._isLoggedIn) {
            const result: CartItem[] | undefined = await this.userService.removeOrderItemFromCart(
                cartItem.item.id,
            );
            if (result) {
                this.cartItems = result;
                this._cartItemsCount = this.cartItems.length;
            }
        } else {
            const index: number = this.cartItems.indexOf(cartItem);
            this.cartItems.splice(index, 1);
            this._cartItemsCount = this.cartItems.length || 0;
            localStorage.setItem("cart", JSON.stringify(this.cartItems));
        }

        this.dispatchEvent(
            new CustomEvent("cart-updated", {
                detail: {
                    cartItems: this.cartItems,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private _renderInfoConfirmation(): HTMLTemplateResult {
        const discount: number | undefined = this.yourDiscount();
        return html`
            <h1 class="title">Just a few steps left to go!</h1>
            <div id="steps">
                <div class="stepnmbr" @click="${(): void => this.updateStep(1)}">Step 1</div>
                <div class="stepnmbr" id="currentstep" @click="${(): void => this.updateStep(3)}">Step 2</div>
                <div class="stepnmbr" @click="${(): void => this.updateStep(4)}">Step 3</div>
            </div>
            <div class="adressInfo">
                <h2 class="infotxt">Please confirm your information</h2>
                <form>
                    ${this._isLoggedIn
                        ? html`<label>Name</label> <input type="text" disabled value="${this._name}" /> <br />
                              <label>Email</label> <input type="text" disabled value="${this._email}" />
                              <br />`
                        : html`<label>Name</label> <input type="text" /><br />
                              <label>Email</label> <input type="text" /><br />`}

                    <label>Street</label>
                    <input
                        type="text"
                        @change="${this._onChangeStreet}"
                        value="${this._adressData.street}"
                    /><br />
                    <label>City</label>
                    <input
                        type="text"
                        @change="${this._onChangeCity}"
                        value="${this._adressData.city}"
                    /><br />
                    <label>Zip</label>
                    <input type="text" @change="${this._onChangeZip}" value="${this._adressData.zip}" /><br />
                    <label>Country</label
                    ><input
                        type="text"
                        @change="${this._onChangeCountry}"
                        value="${this._adressData.country}"
                    /><br />
                    <div id="points">
                        <label
                            >you currently have ${this._user.savedPoints} points saved, do you want to use
                            them?
                        </label>
                        <br />
                        <p>You will save &euro;${discount} with this transaction</p>
                        <select id="discountOption" @change="${this._usePoints}">
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="nxtstep">
                <button class="button" type="submit" @click="${(): number => (this.shoppingCartStep = 4)}">
                    Next Step
                </button>
            </div>
        `;
    }

    private _usePoints(e: Event): void {
        const result: string = (e.target as HTMLSelectElement).value;
        if (result === "yes") {
            this._usedPoints = this._user.savedPoints;
        } else {
            this._usedPoints = undefined;
        }
    }

    private yourDiscount(): number | undefined {
        const points: number | undefined = this._user.savedPoints;
        if (points) {
            const discount: number = points / 100;
            return discount;
        }
        return undefined;
    }

    private newSavedPoints(): number {
        const totalAmount: number = this.calculateTotalPrice();
        const newPoints: number = Math.trunc(totalAmount);

        return newPoints;
    }

    private _renderUserConfirmation(): HTMLTemplateResult {
        if (this._isLoggedIn) {
            return this._renderInfoConfirmation();
        }

        return html`
            <h1 class="title">How do you want to continue?</h1>
            <div id="steps">
                <div class="stepnmbr" id="currentstep" @click="${(): void => this.updateStep(1)}">Step 1</div>
                <div class="stepnmbr" @click="${(): void => this.updateStep(3)}">Step 2</div>
                <div class="stepnmbr" @click="${(): void => this.updateStep(4)}">Step 3</div>
            </div>
            <div class="infochoice">
                <p>No account? No worries! You can just continue as a guest!</p>
                <button
                    class="button"
                    @click=${(): void => {
                        this.shoppingCartStep = 3;
                    }}
                >
                    Continue as a guest
                </button>
                <p>Or you can log in here:</p>
                <button class="button" href="">Login</button>
            </div>
        `;
    }

    private clearShoppingCart(): void {
        localStorage.removeItem("cart");
    }

    private _renderOrderConfirmation(): HTMLTemplateResult {
        void this.order();
        this.clearShoppingCart();
        return html`
            <h1 class="title">Thank you for ordering!</h1>
            <h2>A confirmation email for your order will be sent shortly</h2>
        `;
    }

    private calculateTotalPrice(): number {
        let totalPrice: number = 0;

        for (const cartItem of this.cartItems) {
            totalPrice += cartItem.item.price * cartItem.amount;
        }

        return totalPrice;
    }

    private updateStep(step: number): void {
        if (step > this.shoppingCartStep) return;

        this.shoppingCartStep = step;
    }

    private async _onChangeStreet(e: Event): Promise<void> {
        this._adressData.street = (e.target as HTMLInputElement).value;
        await this.changeAddress();
    }

    private async _onChangeCity(e: Event): Promise<void> {
        this._adressData.city = (e.target as HTMLInputElement).value;
        await this.changeAddress();
    }

    private async _onChangeZip(e: Event): Promise<void> {
        this._adressData.zip = (e.target as HTMLInputElement).value;
        await this.changeAddress();
    }

    private async _onChangeCountry(e: Event): Promise<void> {
        this._adressData.country = (e.target as HTMLInputElement).value;
        await this.changeAddress();
    }

    private async changeAddress(): Promise<void> {
        const address: Address | undefined = await this._addressService.setAddressForUser({
            id: this._adressData.id,
            street: this._adressData.street || "",
            city: this._adressData.city || "",
            zip: this._adressData.zip || "",
            country: this._adressData.country || "",
        });

        this._adressData = address || this._adressData;
    }

    private async order(): Promise<void> {
        await this._orderService.order(this.cartItems, this._adressData, this._usedPoints);

        const amount: any = this.calculateNewPoints();
        await this.userService.setSavedPointsAmount(amount).then(() => (this._user.savedPoints = amount));
    }

    private calculateNewPoints(): number {
        if (this._user.savedPoints) {
            if (this._usedPoints) {
                return this.newSavedPoints();
            } else {
                return this._user.savedPoints + this.newSavedPoints();
            }
        } else {
            return this._usedPoints || this.newSavedPoints();
        }
    }
}

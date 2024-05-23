import { css, html, HTMLTemplateResult, LitElement, nothing, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { Address, CartItem, UserData } from "@shared/types";
import { AddressService } from "../services/AddressService";

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("webshop-root")
export class RootComponent extends LitElement {
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

        table,
        th,
        td {
            border: 3px solid #373e98;
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
            border: 3px solid #373e98;
            display: inline;
            padding: 10px;
        }

        #currentstep {
            background-color: #373e98;
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
            border: 3px solid #373e98;
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
    `;

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    private _orderItems: OrderItem[] = [];

    @state()
    public _cartItemsCount: number = 0;

    @state()
    public _cartItems: CartItem[] = [];

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _tokenService: TokenService = new TokenService();
    private _addressService: AddressService = new AddressService();

    private _user: UserData = {
        email: "",
        name: "",
        id: 0,
    };

    private _adressData: Address = {
        id: 0,
        street: "",
        city: "",
        zip: "",
        country: "",
        user: this._user,
    };

    private _email: string = "";
    private _password: string = "";
    private _name: string = "";
    private _firstname: string = "";
    private _lastname: string = "";

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getWelcome();
        await this.getOrderItems();
        await this.getAddress();
    }

    /**
     * Check if the current token is valid and update the cart item total
     */
    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._user = result.user;
            this._email = result.user.email;
            this._name = result.user.name;
            this._firstname = result.user.firstName || "";
            this._lastname = result.user.lastName || "";
            this._isLoggedIn = true;
            this._cartItemsCount = result.cartItems?.length || 0;
            this._cartItems = result.cartItems || [];
        }
    }

    private async getAddress(): Promise<void> {
        const result: Address | undefined = await this._addressService.getAddressForUser();

        if (!result) {
            return;
        }

        console.log(result);
        this._adressData = result;
    }

    /**
     * Get all available order items
     */
    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();

        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    /**
     * Handler for the login form
     */
    private async submitLoginForm(): Promise<void> {
        // TODO: Validation

        const result: boolean = await this._userService.login({
            email: this._email,
            password: this._password,
        });

        if (result) {
            alert("Successfully logged in!");

            await this.getWelcome();

            this._currentPage = RouterPage.Home;
        } else {
            alert("Failed to login!");
        }
    }

    /**
     * Handler for the register form
     */
    private async submitRegisterForm(): Promise<void> {
        // TODO: Validation

        const result: boolean = await this._userService.register({
            email: this._email,
            firstname: this._firstname,
            lastname: this._lastname,
            password: this._password,
            name: this._name,
        });

        if (result) {
            alert("Successfully registered!");

            this._currentPage = RouterPage.Login;
        } else {
            alert("Failed to register!");
        }
    }

    /**
     * Handler for the cart button
     */
    private async clickCartButton(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (!result) {
            return;
        }

        this._cartItemsCount = result.cartItems?.length || 0;
        this._currentPage = RouterPage.ShoppingCart;
    }

    /**
     * Handler for the logout button
     */
    private clickLogoutButton(): void {
        this._tokenService.removeToken();

        this._isLoggedIn = false;
    }

    /**
     * Handler for the "Add to cart"-button
     *
     * @param orderItem Order item to add to the cart
     */
    private async addItemToCart(orderItem: OrderItem): Promise<void> {
        const result: CartItem[] | undefined = await this._userService.addOrderItemToCart(orderItem.id);

        if (!result) {
            return;
        }

        this._cartItems = result;
        this._cartItemsCount = result?.length || 0;
    }

    /**
     * Renders the components
     */
    protected render(): TemplateResult {
        let contentTemplate: TemplateResult;

        switch (this._currentPage) {
            case RouterPage.Login:
                contentTemplate = this.renderLogin();
                break;
            case RouterPage.Register:
                contentTemplate = this.renderRegister();
                break;
            case RouterPage.ShoppingCart:
                contentTemplate = this.renderShoppingCart();
                break;
            case RouterPage.OrderConfirmation:
                contentTemplate = this._renderOrderConfirmation();
                break;
            case RouterPage.InfoConfirmation:
                contentTemplate = this._renderInfoConfirmation();
                break;
            case RouterPage.Admin:
                contentTemplate = this.renderAdmin();
                break;
            default:
                contentTemplate = this.renderHome();
        }

        return html`
            <header>
                <nav>
                    <div
                        class="logo"
                        @click=${(): void => {
                            this._currentPage = RouterPage.Home;
                        }}
                    >
                        <img src="/assets/img/logo.png" alt="Logo" />
                    </div>

                    ${this.renderLoginInNav()} ${this.renderRegisterInNav()} ${this.renderCartInNav()}
                    ${this.renderProductInNav()} ${this.renderAdminInNav()} ${this.renderLogoutInNav()}
                </nav>
            </header>
            <main>${contentTemplate}</main>
            <footer>Copyright &copy; Luca Stars 2024</footer>
        `;
    }

    /**
     * Renders the home page, which contains a list of all order items.
     */
    private renderHome(): TemplateResult {
        const orderItems: TemplateResult[] = this._orderItems.map((e) => this.renderOrderItem(e));

        if (orderItems.length === 0) {
            return html`<div class="order-items">Laden... Even geduld alstublieft.</div> `;
        }

        return html`
            <h1>Welkom op de webshop</h1>

            ${this._isLoggedIn
                ? nothing
                : html`<p>Je moet ingelogd zijn om producten aan je winkelmandje toe te kunnen voegen!</p>`}

            <div class="order-items">${orderItems}</div>
        `;
    }

    /**
     * Renders a single order item
     *
     * @param orderItem Order item to render
     */
    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        return html`
            <div class="order-item"></div>
                <h2 id="name${orderItem.id}" @click=${(): Promise<OrderItem> => this.getSingleOrder(orderItem)}>${orderItem.name}</h2>
                <p id="description${orderItem.id}">${orderItem.description}</p>
                <p id="price${orderItem.id}">€${orderItem.price}</p>
                ${
                    this._isLoggedIn
                        ? html`<button
                              @click=${async (): Promise<void> => await this.addItemToCart(orderItem)}
                          >
                              Toevoegen aan winkelmandje
                          </button>`
                        : nothing
                }
                ${
                    this._isLoggedIn // should be admin
                        ? html`<button
                              @click=${async (): Promise<void> => await this.deleteOrderItem(orderItem)}
                          >
                              Verwijderen
                          </button>`
                        : nothing
                }

                ${
                    this._isLoggedIn // should be admin
                        ? html`<button @click=${(): void => this.changeToInputField(orderItem)}>Edit</button>`
                        : nothing
                }
                ${
                    this._isLoggedIn // should be admin
                        ? html`<button
                              @click=${async (): Promise<void> => await this.updateOrderItemLogic(orderItem)}
                          >
                              update
                          </button>`
                        : nothing
                }
            </div>
        `;
    }

    private changeToInputField(orderItem: OrderItem): void {
        if (!this.shadowRoot) {
            return;
        }
        const nameElement: HTMLElement | null = this.shadowRoot?.getElementById(`name${orderItem.id}`);
        const descriptionElement: HTMLElement | null = this.shadowRoot?.getElementById(
            `description${orderItem.id}`,
        );
        const priceElement: HTMLElement | null = this.shadowRoot?.getElementById(`price${orderItem.id}`);

        if (!nameElement || !descriptionElement || !priceElement) {
            return;
        }

        nameElement.innerHTML = `<input type="text" value="${orderItem.name}" id="names${orderItem.id}" />`;
        descriptionElement.innerHTML = `<input type="text" value="${orderItem.description}" id="descriptions${orderItem.id}" />`;
        priceElement.innerHTML = `<input type="number" value="${orderItem.price}" id="prices${orderItem.id}" />`;
    }

    private async updateOrderItemLogic(orderItem: OrderItem): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const nameElement: HTMLInputElement | null = this.shadowRoot?.getElementById(
            `names${orderItem.id}`,
        ) as HTMLInputElement;
        const descriptionElement: HTMLInputElement | null = this.shadowRoot?.getElementById(
            `descriptions${orderItem.id}`,
        ) as HTMLInputElement;
        const priceElement: HTMLInputElement | null = this.shadowRoot?.getElementById(
            `prices${orderItem.id}`,
        ) as HTMLInputElement;

        if (!nameElement || !descriptionElement || !priceElement) {
            return;
        }

        orderItem.name = nameElement.value;
        orderItem.description = descriptionElement.value;
        orderItem.price = parseFloat(priceElement.value);
        await this.updateOrderItem(orderItem);
    }

    private async getSingleOrder(orderItem: OrderItem): Promise<OrderItem> {
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/${orderItem.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch order item");
        }

        try {
            return await response.json();
        } catch (error) {
            console.error("Error parsing JSON:", error);
            throw new Error("Failed to parse order item data");
        }
    }

    private async deleteOrderItem(orderItem: OrderItem): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/${orderItem.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete order item");
        }

        alert("Order item deleted successfully");
    }

    private async updateOrderItem(orderItem: OrderItem): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(
            `${viteConfiguration.API_URL}orderItems/update/${orderItem.id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderItem),
            },
        );

        if (!response.ok) {
            throw new Error("Failed to update order item");
        }

        alert("Order item updated successfully");
    }

    /**
     * Renders the login page
     */
    private renderLogin(): TemplateResult {
        return html`
            <div class="form">
                ${this.renderEmail()} ${this.renderPassword()}

                <div>
                    <button @click="${this.submitLoginForm}" type="submit">Inloggen</button>
                </div>

                <div>
                    Of
                    <button
                        @click="${(): void => {
                            this._currentPage = RouterPage.Register;
                        }}"
                    >
                        Registreer
                    </button>
                    je door hier te klikken.
                </div>
            </div>
        `;
    }

    /**
     * Renders the register page
     */
    private renderRegister(): TemplateResult {
        return html`
            <div class="form">
                <div>
                    <label for="username">Gebruikersnaam</label>
                    <input type="text" id="name" value=${this._name} @change=${this.onChangeName} />
                    <label for="voornaam">Voornaam</label>
                    <input
                        type="text"
                        id="firstname"
                        value=${this._firstname}
                        @change=${this.onChangeFirstName}
                    />
                    <label for="achternaam">Achternaam</label>
                    <input
                        type="text"
                        id="lastname"
                        value=${this._lastname}
                        @change=${this.onChangeLastName}
                    />
                </div>

                ${this.renderEmail()} ${this.renderPassword()}

                <div>
                    <button @click="${this.submitRegisterForm}" type="submit">Registreer</button>
                </div>

                <div>
                    Of
                    <button
                        @click="${(): void => {
                            this._currentPage = RouterPage.Login;
                        }}"
                    >
                        Login
                    </button>
                    door hier te klikken.
                </div>
            </div>
        `;
    }

    private handleClick(): void {
        const result: any = {
            name: this._email,
        };

        console.log(result);
    }

    private renderAdmin(): TemplateResult {
        return html`
            <button @click=${this.handleClick}>Click me</button>
            <div>Admin page van ${this._email}</div>
        `;
    }

    private renderShoppingCart(): TemplateResult {
        const totalAmount: number = this.calculateTotalPrice();

        return html`
            <h1 class="title">Just a few steps left to go!</h1>
            <div id="steps">
                <div class="stepnmbr" id="currentstep">Step 1</div>
                <div class="stepnmbr">Step 2</div>
                <div class="stepnmbr">Step 3</div>
            </div>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
                ${this._cartItems.map((cartItem) => {
                    return html`
                        <tr>
                            <td>${cartItem.item.name}</td>
                            <td>${cartItem.amount}</td>
                            <td>${cartItem.item.price}</td>
                            <td>
                                <b
                                    >&euro;
                                    ${(Math.round(cartItem.item.price * cartItem.amount * 100) / 100).toFixed(
                                        2,
                                    )}</b
                                >
                            </td>
                        </tr>
                    `;
                })}
            </table>
            <div class="nxtstep">
                <h2>Your total is: &euro; ${totalAmount.toFixed(2)}</h2>
                <button class="button" type="submit" @click="${this._renderInfoConfirmation}">
                    Next Step
                </button>
            </div>
        `;
    }

    private calculateTotalPrice(): number {
        let totalPrice: number = 0;

        for (const cartItem of this._cartItems) {
            totalPrice += cartItem.item.price * cartItem.amount;
        }

        return totalPrice;
    }

    private _renderInfoConfirmation(): HTMLTemplateResult {
        this._currentPage = RouterPage.InfoConfirmation;

        return html`
            <h1 class="title">Confirm your information</h1>
            <div id="steps">
                <div class="stepnmbr">Step 1</div>
                <div class="stepnmbr" id="currentstep">Step 2</div>
                <div class="stepnmbr">Step 3</div>
            </div>
            <div class="adressInfo">
                <form>
                    <label>Username</label><input type="text" disabled value="${this._name}" /><br />
                    <label>Email</label><input type="text" disabled value="${this._email}" /><br />
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
                </form>
            </div>
            <div class="nxtstep">
                <button class="button" type="submit" @click="${this._renderOrderConfirmation}">
                    Next Step
                </button>
            </div>
        `;
    }

    /**
     * Handles changes to the adress input field
     */
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

    private _renderOrderConfirmation(): HTMLTemplateResult {
        this._currentPage = RouterPage.OrderConfirmation;

        return html` <h1 class="title">Thank you for ordering!</h1> `;
    }

    /**
     * Renders the login button in the navigation
     */
    private renderLoginInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Login;
            }}
        >
            <button>Inloggen</button>
        </div>`;
    }

    /**
     * Renders the product button in the navigation
     */
    private renderProductInNav(): TemplateResult {
        return html`
            <div>
                <a href="/product-page.html">
                    <button>Products</button>
                </a>
            </div>
        `;
    }

    /**
     * Renders the product button in the navigation
     */

    private renderAdminInNav(): TemplateResult {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (this._user.authorizationLevel === AuthorizationLevel.ADMIN) {
            return html` <div>
                <a href="/admin-page.html" target="">
                    <button>Admin</button>
                </a>
            </div>`;
        }
        return html``;
    }

    /**
     * Renders the register button in the navigation
     */
    private renderRegisterInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html` <div
            @click=${(): void => {
                this._currentPage = RouterPage.Register;
            }}
        >
            <button>Registreren</button>
        </div>`;
    }

    /**
     * Renders the cart button in the navigation
     */
    private renderCartInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div @click=${this.clickCartButton}>
            <button>Winkelmandje (${this._cartItemsCount} producten)</button>
        </div>`;
    }

    /**
     * Renders the logout button in the navigation
     */
    private renderLogoutInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`
            <div @click=${this.clickLogoutButton}>
                <button>Logout</button>
            </div>
        `;
    }

    /**
     * Renders the e-mail input field with change-tracking
     */
    private renderEmail(): TemplateResult {
        return html`<div>
            <label for="email">E-mail</label>
            <input
                type="text"
                name="email"
                placeholder="test@test.nl"
                value=${this._email}
                @change=${this.onChangeEmail}
            />
        </div>`;
    }

    /**
     * Renders the password input field with change-tracking
     */
    private renderPassword(): TemplateResult {
        return html`<div>
            <label for="password">Wachtwoord</label>
            <input type="password" value=${this._password} @change=${this.onChangePassword} />
        </div>`;
    }

    /**
     * Handles changes to the e-mail input field
     */
    private onChangeEmail(event: InputEvent): void {
        this._email = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the password input field
     */
    private onChangePassword(event: InputEvent): void {
        this._password = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the name input field
     */
    private onChangeName(event: InputEvent): void {
        this._name = (event.target as HTMLInputElement).value;
    }
    private onChangeFirstName(event: InputEvent): void {
        this._firstname = (event.target as HTMLInputElement).value;
    }
    private onChangeLastName(event: InputEvent): void {
        this._lastname = (event.target as HTMLInputElement).value;
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
}

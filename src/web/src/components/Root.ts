import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

/** Enumeration to keep track of all the different pages */
enum RouterPage {
    Home = "orderItems",
    Login = "login",
    Register = "register",
}

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("webshop-root")
export class Root extends LitElement {
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

        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form label {
            display: block;
            margin-bottom: 5px;
        }
    `;

    @state()
    private _currentPage: RouterPage = RouterPage.Home;

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    private _orderItems: OrderItem[] = [];

    @state()
    public _cartItemsCount: number = 0;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _tokenService: TokenService = new TokenService();

    private _email: string = "";
    private _password: string = "";
    private _name: string = "";

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getWelcome();
        await this.getOrderItems();
    }

    /**
     * Check if the current token is valid and update the cart item total
     */
    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._isLoggedIn = true;
            this._cartItemsCount = result.cartItems?.length || 0;
        }
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
            alert("Succesfully logged in!");

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
            password: this._password,
            name: this._name,
        });

        if (result) {
            alert("Succesfully registered!");

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

        alert(
            `Hallo ${result.email}!\r\n\r\nJe hebt de volgende producten in je winkelmandje:\r\n- ${
                result.cartItems?.join("\r\n- ") || "Geen"
            }`
        );
    }

    /**
     * Handler for the logout button
     */
    private async clickLogoutButton(): Promise<void> {
        await this._userService.logout();

        this._tokenService.removeToken();

        this._isLoggedIn = false;
    }

    /**
     * Handler for the "Add to cart"-button
     *
     * @param orderItem Order item to add to the cart
     */
    private async addItemToCart(orderItem: OrderItem): Promise<void> {
        const result: number | undefined = await this._userService.addOrderItemToCart(orderItem.id);

        if (!result) {
            return;
        }

        this._cartItemsCount = result;
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
                    ${this.renderLogoutInNav()}
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
            <h1>Welkom op de Luca Stars webshop!</h1>

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
            <div class="order-item">
                <h2>${orderItem.name}</h2>
                <p>${orderItem.description}</p>
                ${this._isLoggedIn
                    ? html`<button @click=${async (): Promise<void> => await this.addItemToCart(orderItem)}>
                          Toevoegen aan winkelmandje
                      </button>`
                    : nothing}
            </div>
        `;
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
                    <label for="username">Naam</label>
                    <input type="text" id="name" value=${this._name} @change=${this.onChangeName} />
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
}

import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItem } from "@shared/types/CartItem";
import { UserData } from "@shared/types/UserData";
import { LitElement, TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";



/** Enumeration to keep track of all the different pages */
enum RouterPage {
    Home = "orderItems",
    Login = "login",
    Register = "register",
    products = "product",
    Admin = "admin",
    ShoppingCart = "shoppingCart",
    OrderConfirmation = "orderConfirmation",
    InfoConfirmation = "infoConfirmation",
}

/**
 * @enum AuthorizationLevel
 * @description Een enumeratie van autorisatieniveaus.
 */
export enum AuthorizationLevel {
    USER = "user",
    EMPLOYEE = "employee",
    ADMIN = "admin",
}

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("webshop-root")
export class navbar extends LitElement {

    @state()
    private _currentPage: RouterPage = RouterPage.Home;

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    public _cartItemsCount: number = 0;

    @state()
    public _cartItems: CartItem[] = [];

    
    private _tokenService: TokenService = new TokenService();
    private _userService: UserService = new UserService();

    
    private _user: UserData = {
        email: "",
        password: "",
        name: "",
        id: 0,
    };
    
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
}
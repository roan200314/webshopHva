import { html, css, TemplateResult, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { LitElement } from "lit";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserData } from "@shared/types";
import { AuthorizationLevel } from "../models/interfaces/AuthorizationLevel";
import { TokenService } from "../services/TokenService";

@customElement("navbar-component")
export class NavbarComponent extends LitElement {

    @state()
    private isLoggedIn: boolean = false;

    @state()
    private userData: UserData | undefined;

    @state()
    private cartItemCount: number = 0;

    @state()
    private authorizedLevel: AuthorizationLevel = AuthorizationLevel.USER;

    private userService: UserService = new UserService();
    private tokenService: TokenService = new TokenService();

    public static styles = css`
        .navbar {
            display: flex;
            justify-content: space-between;
            background-color: #4B515D;
            padding: 1rem 2rem;
            color: white;
            box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
        }
        .navbar-item {
            margin-right: 1.5rem;
            text-decoration: none;
            color: #FFFFFF;
            transition: color 0.3s ease;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            align-self: center;
        }
        .navbar-item:hover {
            background: #3B404B;
        }
        .navbar-item:last-child {
            margin-right: 0;
        }
        .left-nav, .right-nav {
            display: flex;
        }
        @media (max-width: 800px) {
            .navbar {
                flex-direction: column;
                align-items: flex-start;
            }
            .navbar-item {
                margin-top: 0.5rem;
            }
        }
        .logout {
            background-color: #FF6347;
            color: #FFFFFF;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
            box-shadow: 0 2px 15px -4px rgba(0, 0, 0, 0.3);
        }
        .logout:hover {
            background-color: #FF4500;
        }
        .navbar-item img.cart-icon {
            height: 30px;
            width: 30px;
            margin-right: 5px;    /* add some space between the icon and the number */
            vertical-align: middle;  /* align the icon with the number */
        }
        .navbar-item span {
            vertical-align: middle;  /* align the number with the icon */
            line-height: 30px;
        }
    `;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getUserInformation();

        window.addEventListener("cart-update", (): void => {
            void (async (): Promise<void> => {
                await this.getUserInformation();
            })();
        });
    }

    public render(): TemplateResult {
        return html`
            <div class="navbar">
                <nav class="left-nav">
                    <a href="/index" class="navbar-item">Home</a>
                    ${this.isLoggedIn
                            ? html`
                                ${this.authorizedLevel === AuthorizationLevel.ADMIN
                                        ? html`
                                            <a href="/admin" class="navbar-item">Admin Page</a>
                                        `
                                        : nothing }
                            `
                            : nothing }
                </nav>
                <nav class="right-nav">
                    ${this.isLoggedIn
                            ? html`
                                <a href="/cart" class="navbar-item">
                                    <img src="/assets/img/cart.png" alt="Cart" class="cart-icon">
                                    <span>${this.cartItemCount}</span>
                                </a>
                                <span class="navbar-item">Hello, ${this.userData?.name}</span>
                                <button @click="${this.handleLogout}" class="navbar-item logout">Logout</button>
                            `
                            : html`
                                <a href="/login" class="navbar-item">Login</a>
                                <a href="/register" class="navbar-item">Register</a>
                            `}
                </nav>
            </div>
        `;
    }

    private async getUserInformation(): Promise<void> {
        const userInformation: UserHelloResponse | undefined = await this.userService.getWelcome();
        if (!userInformation || !userInformation.user) return;
        if (!userInformation.user.authorizationLevel) return;

        this.isLoggedIn = true;
        this.userData = userInformation.user;
        this.authorizedLevel = userInformation.user.authorizationLevel;

        this.cartItemCount = userInformation.cartItems?.length || 0;
    }

    private handleLogout(): void {
        this.isLoggedIn = false;
        this.userData = undefined;
        this.authorizedLevel = AuthorizationLevel.USER;

        this.tokenService.removeToken();
        window.location.href = "/";
    }
}
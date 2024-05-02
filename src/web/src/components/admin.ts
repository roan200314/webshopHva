import { LitElement, TemplateResult, css, html, render } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItemService } from "../services/OrderItemService";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { OrderItem, UserData } from "@shared/types";

/** Enumeration to keep track of all the different pages */
enum RouterPage {
    Home = "orderItems",
    Login = "login",
    Register = "register",
    products = "product",
    Admin = "admin",
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
    private _getUsersService: UserService = new UserService();
    private _deleteUserService: UserService = new UserService();
    private _tokenService: TokenService = new TokenService();
    private _email: string = "";
    private _password: string = "";
    private _name: string = "";
    private _firstname: string = "";
    private _lastname: string = "";

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getWelcome();
        await this.getOrderItems();
        await this.getAdmin();
        await this.showAllUsers();
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

    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();

        if (result && result.length > 0) {
            const allordersTable: HTMLTableSectionElement | null = document.getElementById(
                "allOrdersTable",
            ) as HTMLTableSectionElement;
            if (allordersTable) {
                allordersTable.innerHTML = "";

                result.forEach((orderdata) => {
                    console.log("orders:", orderdata);

                    const row: any = document.createElement("tr");

                    if (this._isLoggedIn) {
                        render(
                            html`
                                <td>${orderdata.id}</td>
                                <td>${orderdata.description}</td>
                                <td>${orderdata.name}</td>
                                <td>${orderdata.price}</td>
                            `,
                            row,
                        );
                    }

                    allordersTable.appendChild(row);
                    console.log("data found");
                });
            }
        } else {
            console.log("No orders found.");
        }
    }

    private async getAdmin(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();
        if (result) {
            const adminNameDiv: HTMLElement | null = document.getElementById("adminName");
            if (adminNameDiv) {
                adminNameDiv.innerText = "Hi admin " + `${result.name}`;
            }
        }
    }

    private async showAllUsers(): Promise<void> {
        const result: UserData[] | undefined = await this._getUsersService.getUsers();

        if (result && result.length > 0) {
            const allUsersTable: HTMLTableSectionElement | null = document.getElementById(
                "allUsersTable",
            ) as HTMLTableSectionElement;
            if (allUsersTable) {
                allUsersTable.innerHTML = "";

                result.forEach((userdata) => {
                    console.log("User:", userdata);

                    const row: any = document.createElement("tr");

                    if (this._isLoggedIn) {
                        render(
                            html`
                                <td>${userdata.id}</td>
                                <td>${userdata.name}</td>
                                <td>${userdata.email}</td>
                                <td>
                                    <select
                                        @change=${(e: Event): Promise<void> =>
                                            this.handleAuthorizationLevelChange(e, userdata.id)}
                                    >
                                        <option
                                            value="${AuthorizationLevel.EMPLOYEE}"
                                        >
                                            Employee
                                        </option>

                                        <option
                                            value="${AuthorizationLevel.USER}"
                                        >
                                            User
                                        </option>
                                        <option
                                            value="${AuthorizationLevel.ADMIN}"
                                        >
                                            Admin
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        class="btn btn-danger delete-btn"
                                        @click=${async (): Promise<void> =>
                                            await this._getUsersService.deleteFun(userdata.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        class="btn btn-blue update-btn"
                                        @click=${async (): Promise<void> => {
                                            const authorizationLevelString: any =
                                                userdata.authorizationLevel?.toString();
                                            if (authorizationLevelString) {
                                                await this._getUsersService.updateFun(
                                                    userdata.id,
                                                    authorizationLevelString,
                                                );
                                            } else {
                                                console.error("Authorization level is undefined");
                                            }
                                        }}
                                    >
                                        update
                                    </button>
                                </td>
                            `,
                            row,
                        );
                    }

                    allUsersTable.appendChild(row);
                });
            }
        } else {
            console.log("No users found.");
        }
    }

    public async handleAuthorizationLevelChange(e: Event, userId: number): Promise<void> {
        const selectElement: any = e.target as HTMLSelectElement;
        const newAuthorizationLevel: any = selectElement.value as AuthorizationLevel;

        try {
            await this._getUsersService.updateFun(userId, newAuthorizationLevel);
            console.log("Authorization level updated successfully");
        } catch (error) {
            console.error("Failed to update authorization level:", error);
        }
    }

    /**
     * Renders the components
     */
    protected render(): TemplateResult {
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
                </nav>
            </header>
            <footer>Copyright &copy; Luca Stars 2024</footer>
        `;
    }
}

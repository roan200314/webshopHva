import { LitElement, TemplateResult, css, html, render } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItemService } from "../services/OrderItemService";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { OrderItem, UserData } from "@shared/types";

/**
 * @enum AuthorizationLevel
 * @description An enumeration of authorization levels.
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
@customElement("admin-root")
export class Admin extends LitElement {
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
    private _isLoggedIn: boolean = false;
    @state()
    public _cartItemsCount: number = 0;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _getUsersService: UserService = new UserService();
    private _deleteUserService: UserService = new UserService();
    private selectedAuthorizationLevel: string = "";

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

        if (!result || result.length === 0) {
            console.log("No orders found.");
            return;
        }

        const allOrdersTable: HTMLTableSectionElement | null = document.getElementById(
            "allOrdersTable",
        ) as HTMLTableSectionElement;
        if (!allOrdersTable) return;

        allOrdersTable.innerHTML = "";

        result.forEach((orderdata) => {
            const row: any = document.createElement("tr");
            if (!this._isLoggedIn) return;

            render(
                html`
                    <td>${orderdata.id}</td>
                    <td>${orderdata.description}</td>
                    <td>${orderdata.name}</td>
                    <td>${orderdata.price}</td>
                    <button
                        class="btn btn-danger delete-btn"
                        @click=${async (): Promise<void> =>
                            await this._orderItemService.deleteOrderFunction(orderdata.id)}
                    >
                        Delete
                    </button>
                `,
                row,
            );

            allOrdersTable.appendChild(row);
            console.log("data found");
        });
    }

    private async getAdmin(): Promise<void> {
        const result: UserData | undefined = await this._userService.getUserData();
        if (result) {
            const adminNameDiv: HTMLElement | null = document.getElementById("adminName");
            if (adminNameDiv) {
                adminNameDiv.innerText = "Hi " + result.authorizationLevel + ` ${result.name}`;
            }
        }
    }

    private async showAllUsers(): Promise<void> {
        const result: UserData[] | undefined = await this._getUsersService.getUsers();
        if (!result || result.length === 0) {
            return;
        }

        const allUsersTable: HTMLTableSectionElement | null = document.getElementById(
            "allUsersTable",
        ) as HTMLTableSectionElement;
        if (!allUsersTable) return;
        allUsersTable.innerHTML = "";
        result.forEach((userdata) => {
            const row: any = document.createElement("tr");

            if (!this._isLoggedIn) return;

            render(
                html`
                    <td>${userdata.id}</td>
                    <td>${userdata.name}</td>
                    <td>${userdata.email}</td>
                    <td>${userdata.authorizationLevel}</td>
                    <td>
                        <select
                            @change=${(e: Event): void => {
                                const selectElement: HTMLSelectElement = e.target as HTMLSelectElement;
                                this.selectedAuthorizationLevel = selectElement.value as AuthorizationLevel;
                            }}
                        >
                            <option value="${AuthorizationLevel.ADMIN}">Admin</option>
                            <option value="${AuthorizationLevel.EMPLOYEE}">Employee</option>
                            <option value="${AuthorizationLevel.USER}">User</option>
                        </select>
                    </td>
                    <td>
                        <button
                            class="btn btn-danger delete-btn"
                            @click=${async (): Promise<void> =>
                                await this._deleteUserService.deleteFun(userdata.id)}
                        >
                            Delete
                        </button>
                        <button
                            class="btn btn-success update-btn"
                            @click=${async (): Promise<void> => {
                                if (this.selectedAuthorizationLevel) {
                                    await this._getUsersService.updateFun(
                                        userdata.id,
                                        this.selectedAuthorizationLevel,
                                    );
                                    window.location.reload();
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

            allUsersTable.appendChild(row);
        });
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
                    <div class="logo">
                        <a href="/index.html">
                            <img src="/assets/img/logo.png" alt="Logo" />
                        </a>
                    </div>
                </nav>
            </header>

        `;
    }
}

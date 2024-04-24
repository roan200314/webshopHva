import { LitElement, TemplateResult, css, html} from "lit";
import { customElement, state} from "lit/decorators.js";
import { OrderItemService } from "../services/OrderItemService";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { OrderItem } from "@shared/types";


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
        await this.retrieveAllUserData();

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

    private async getAdmin(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();
        if (result) {
            const adminNameDiv: HTMLElement | null = document.getElementById("adminName");
            if (adminNameDiv) {
                adminNameDiv.innerText = "Hi admin " + `${result.name}`;
            }
        }
    }
// Assuming you have imported and instantiated the GetUserService class

    	private async  retrieveAllUserData(): Promise<void> {
    try {
        // Instantiate the GetUserService class
        const getUserService: any = new GetUserService();

        // Call the getAllUsers method to fetch all users
        const allUsers: UserDto[] = await getUserService.getAllUsers();

        // Log or process the fetched user data
        console.log("All users:", allUsers);
        // Or you can return the users if needed
        // return allUsers;
    } catch (error) {
        // Handle any errors that might occur during fetching
        console.error("Error retrieving all users:", error);
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
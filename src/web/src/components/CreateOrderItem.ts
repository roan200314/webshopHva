import { LitElement, TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { AuthorizationLevel } from "../pages/AdminPage";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";


@customElement("create-order-item")
export class CreateOrderItemComponent extends LitElement {

    @state()
    private orderItem: any = {
        name: "",
        price: 0,
        description: "",
    };

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    private _isEmployee: boolean = false;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.handleLogin();
        this.render();
    }

    private _tokenService: TokenService = new TokenService();
    private _userService: UserService = new UserService();

    private async handleLogin(): Promise<void> {
        if (this._tokenService.getToken()) {
            this._isLoggedIn = true;
        }
        else {
            return;
        }

        const userData: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (!userData) return;

        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        this._isEmployee = !(!userData || (userData.user.authorizationLevel !== AuthorizationLevel.ADMIN && userData.user.authorizationLevel !== AuthorizationLevel.EMPLOYEE));
    }

    public render(): TemplateResult {
        if (!this._isLoggedIn || !this._isEmployee) return html``;

        return html`
            <form @submit=${this.createOrderItem}>
                <label for="name">Name</label>
                <input type="text" id="name" name="name" @input=${this.updateName} required />
                <label for="price">Price</label>
                <input type="number" id="price" name="price" @input=${this.updatePrice} required />
                <label for="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    @input=${this.updateDescription}
                    required
                ></textarea>
                <button type="submit">Create</button>
            </form>
        `;
    }

    /**
     * Updates the name of the order item.
     * @param event
     */
    private updateName(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.name = input.value;
    }

    /**
     * Updates the price of the order item.
     * @param event
     */
    private updatePrice(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.price = parseFloat(input.value);
    }

    /**
     * Updates the description of the order item.
     * @param event
     */
    private updateDescription(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.description = input.value;
    }

    /**
     * Creates an order item.
     * @param event
     */
    private async createOrderItem(event: Event): Promise<void> {
        event.preventDefault();
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(this.orderItem),
        });
        if (!response.ok) {
            alert("Could not create order item");
        }
        else {
            alert("Order item created successfully");
        }
    }
}

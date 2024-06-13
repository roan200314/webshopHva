import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { AuthorizationLevel } from "../models/interfaces/AuthorizationLevel";

@customElement("create-order-item")
export class CreateOrderItemComponent extends LitElement {
    public static styles = css`
        .order-form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 600px;
        margin: 20px auto; 
        padding: 20px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .order-form label {
        margin-bottom: 8px;
        font-weight: bold;
        color: #333;
    }

    .order-form input[type="text"],
    .order-form input[type="number"],
    .order-form textarea {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 16px;
        color: #333;
    }

    .order-form textarea {
        resize: vertical;
        height: 100px;
    }

    .order-form button {
        padding: 10px 20px;
        background-color: #007bff;
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 4px;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    .order-form button:hover {
        background-color: #0056b3;
    }
    `;


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
    private _tokenService: TokenService = new TokenService();
    private _userService: UserService = new UserService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.handleLogin();
        this.render();
    }

    public render(): TemplateResult {
        if (!this._isLoggedIn || !this._isEmployee) return html``;

        return html`
            <form @submit=${this.createOrderItem} class="order-form">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" @input=${this.updateName} required />
                <label for="price">Price</label>
                <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    @input=${this.updatePrice}
                    required
                />
                <label for="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    @input=${this.updateDescription}
                    required
                ></textarea>
                <label for="image">ImageURL</label>
                <input type="text" id="image" name="image" @input=${this.updateImage} />
                <button type="submit">Create</button>
            </form>
        `;
    }

    private async handleLogin(): Promise<void> {
        if (this._tokenService.getToken()) {
            this._isLoggedIn = true;
        } else {
            return;
        }

        const userData: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (!userData) return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        this._isEmployee = !(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            !userData || (userData.user.authorizationLevel !== AuthorizationLevel.ADMIN && userData.user.authorizationLevel !== AuthorizationLevel.EMPLOYEE)
        );
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
     * Updates the image of the order item.
     * @param event
     */
    private updateImage(event: InputEvent): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        this.orderItem.imageURLs = [input.value];
    }

    /**
     * Creates an order item.
     * @param event
     */
    private async createOrderItem(event: Event): Promise<void> {
        event.preventDefault();
        this.orderItem.itemType = "Merchandise";
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
        } else {
            alert("Order item created successfully");
        }
    }
}

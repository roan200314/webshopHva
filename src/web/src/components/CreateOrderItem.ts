import { LitElement, TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { UserData } from "@shared/types";
import { AuthorizationLevel } from "./Admin";


@customElement("create-order-item")
export class CreateOrderItem extends LitElement {
    @state()
    private orderItem: any = {
        name: "",
        price: 0,
        description: "",
    };

    private _tokenService: TokenService = new TokenService();
    private _userService: UserService = new UserService();

    public async render(): Promise<TemplateResult> {
        if (!this._tokenService.getToken()) return html``;

        const userData: UserData | undefined = await this._userService.getUserData();
        if (!userData) return html``;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (userData.authorizationLevel === AuthorizationLevel.ADMIN) {
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
        } else {
            return html``;
        }
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

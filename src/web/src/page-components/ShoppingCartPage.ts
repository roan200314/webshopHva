import { customElement, state } from "lit/decorators.js";
import { html, LitElement, TemplateResult } from "lit";
import { CartItem } from "@shared/types";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

@customElement("shopping-cart-page")
export class ShoppingCartPage extends LitElement {

    @state()
    private shoppingCartStep: number = 1;

    @state()
    private cartItems: CartItem[] = [];

    private userService: UserService = new UserService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        this.render();

        await this.fetchCartItems();

        window.addEventListener("cart-update", (): void => {
            void (async (): Promise<void> => {
                await this.fetchCartItems();
            })();
        });
    }

    private async fetchCartItems(): Promise<void> {
        const userInformation: UserHelloResponse | undefined = await this.userService.getWelcome();
        if (userInformation && userInformation.cartItems) {
            this.cartItems = userInformation.cartItems;
        }
    }

    public render(): TemplateResult {
        if (this.cartItems.length === 0) {
            return html`
                <h1 class="title">Your shopping cart is empty!</h1>
            `;
        }

        if (this.shoppingCartStep === 1) {
            this.renderShoppingCart();
        }

        return html``;
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
                ${this.cartItems.map((cartItem) => {
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
            </div>
        `;
    }

    private calculateTotalPrice(): number {
        let totalPrice: number = 0;

        for (const cartItem of this.cartItems) {
            totalPrice += cartItem.item.price * cartItem.amount;
        }

        return totalPrice;
    }
}

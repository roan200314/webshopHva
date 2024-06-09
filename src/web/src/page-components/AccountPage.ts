import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Order, UserData } from "@shared/types";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserService } from "../services/UserService";
import { OrderItemService } from "../services/OrderItemService";

@customElement("account-page")
export class AccountPage extends LitElement {

    public static styles = css`
        .title {
            color: #ecae20;
            text-align: center;
            margin: 3%;
        }

        .orderHistory {
            max-width: 800px;
            margin: auto;
            margin-bottom: 100px;
        }
    `;

    private userService: UserService = new UserService();
    private _orderService: OrderItemService = new OrderItemService();


    @state()
    private userData: UserData | undefined;

    @state()
    private name: string | undefined;

    @state()
    private orders: Order[] = [];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getWelcome();
        await this.getOrderHistory();
    }

    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this.userService.getWelcome();
        this.userData = result?.user;       

        if(result){
            this.name = this.userData?.name;
        }
    }

    protected render(): TemplateResult {
        return html`
            <h1 class="title">Account Page of ${this.name}</h1>
            <div class="orderHistory">
                ${this.orders.map((order) => {
                    return html`
                        <hr>
                        <h2>Order ${order.id}:</h2>
                        <ul>
                            <li><b>ID: ${order.id}</b></li>
                            <li><b>Address:</b> ${order.street}, ${order.city}, ${order.country}</li>
                            <li><b>Products:</b></li>
                            <ul>
                                ${order.products.map((orderItem) => {
                                    return html`
                                        <li>
                                            <b>${orderItem.name}</b> (&euro;${orderItem.price})
                                            <br>${orderItem.description}
                                        </li>
                                    `;
                                })}
                            </ul>
                        </ul>
                    `;
                })}
            </div>
        `;
    }

    private async getOrderHistory(): Promise<void> {
        const retrievedOrders: Order[] | undefined = await this._orderService.retrieveOrders();
        if (retrievedOrders) {
            this.orders = retrievedOrders;
        }
    }
}

      


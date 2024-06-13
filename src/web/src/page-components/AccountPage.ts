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

        h2{
            text-align: left;
        }

        h3{
            text-align: center;
        }

        .orderHistory {
            max-width: 800px;
            margin: auto;
            margin-bottom: 100px;
        }

        .order{
            background-color: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 15px;
        }

        li{
            list-style: none;
        }

        table,
        th,
        td {
            border: 1px solid #9f9f9f;
            border-collapse: collapse;
            text-align: left;
        }

        table {
            border-spacing: 30px;
            width: 50%;
        }

        th {
            font-size: 1.2em;
            font-weight: bolder;
            padding: 10px;
        }

        td {
            padding: 10px;
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

        if(this.userData) {
            this.userData.savedPoints = result?.savedPoints;  
        }

        console.log(this.userData);

        if(result){
            this.name = this.userData?.name;
        }
    }

    protected render(): TemplateResult {
        return html`
            <h1 class="title">Account Page of ${this.name}</h1>
            <h3> Je hebt momenteel ${this.userData?.savedPoints} aantal punten gespaard staan</h3>
            <div class="orderHistory">
                ${this.orders.map((order) => {
                    return html`
                        <div class="order">
                            <h2>Order #${order.id}</h2>
                            <ul>
                                <li><b>Send to:</b> ${order.street}, ${order.city}, ${order.country}</li> <br>
                                <li><b>Order status: ${order.status}</b></li>
                                <table>
                                    <tr>
                                        <th>Product:</th>
                                        <th>Price</th>
                                    </tr>
                                    ${order.products.map((orderItem) => {
                                        return html`
                                        <tr>
                                                <td>${orderItem.name}</td>
                                                <td>&euro;${orderItem.price}</td>
                                        </tr>
                                        `;
                                        })}    
                                </table>
                            </ul>
                        </div>
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

      


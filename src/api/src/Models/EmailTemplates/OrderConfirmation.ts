import { CartItem } from "../Entities/CartItem";

export class OrderConfirmation {
    private readonly userName: string;
    private readonly orders: CartItem[];

    public constructor(userName: string, orders: CartItem[]) {
        this.userName = userName;
        this.orders = orders;
    }

    public generate(): string {
        const orderDetails: string = this.orders.map((cartItem: CartItem) =>
            `<tr>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${cartItem.item.name}</td>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${cartItem.amount}</td>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${cartItem.item.price}</td>
        </tr>`
        ).join("");

        return `
    <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #2a7aea;">Thank you for your order!</h2>
        <p>Dear <span style="font-weight: bold;">${this.userName}</span>,</p>
        
        <p>Here are the details of your order:</p>
        
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;"><b>Product Name</b></th>
                    <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;"><b>Quantity</b></th>
                    <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;"><b>Price</b></th>
                </tr>
            </thead>
            <tbody>
                ${orderDetails}
            </tbody>
        </table>
        
        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <p>Thank you for choosing us!</p>
        
        <p>Kind Regards,<br/>Webshop Administration</p>
    </div>
    `;
    }
}

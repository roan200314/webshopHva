import { OrderItem } from "@shared/types";
import { TokenService } from "./TokenService";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};
/**
 * Handles order item related functionality
 */
export class OrderItemService {
    private _tokenService: TokenService = new TokenService();
    /**
     * Get all order items
     *
     * @returns A list of all order items when successful, otherwise `undefined`.
     */
    public async getAll(): Promise<OrderItem[] | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/all`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

    public async deleteOrderFunction(id: number): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/${id}`, {
            method: "DELETE",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response);
        } else {
            alert("item deleted successfully");
        }
    }
}

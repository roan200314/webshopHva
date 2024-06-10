import { Address, CartItem, OrderItem } from "@shared/types";
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

    public async setOrderAsFeatured(id: number, featured: boolean): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();
        const featuredAsString: string = featured ? "true" : "false";
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/featured/${id}/${featuredAsString}`, {
            method: "POST",
            headers: { ...headers, authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error(response);
        }
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

    public async order(cartItems: CartItem[], adressData: Address) : Promise<void> {
        const token: string | undefined = this._tokenService.getToken();

        if (token) {
            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/orderWAccount`, {
                method: "POST",
                headers: { ...headers, authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    "cartItem": cartItems, "adressData": adressData
                })
            });

            if (!response.ok) {
                console.error(response);
            }
        }
        else {
            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/order`, {
                method: "POST",
                body: JSON.stringify({
                    "cartItem": cartItems, "adressData": adressData
                })
            });

            if (!response.ok) {
                console.error(response);
            }
        }
    }

    public async getMerchandiseItems(): Promise<OrderItem[] | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/merchandise`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

    public async getGameItems(): Promise<OrderItem[] | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/game`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }
}

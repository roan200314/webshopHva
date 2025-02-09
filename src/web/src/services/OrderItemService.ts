import { Address, CartItem, Order, OrderItem } from "@shared/types";
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
        const response: Response = await fetch(
            `${viteConfiguration.API_URL}orderItems/featured/${id}/${featuredAsString}`,
            {
                method: "POST",
                headers: { ...headers, authorization: `Bearer ${token}` },
            },
        );

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

    public async order(
        cartItems: CartItem[],
        adressData: Address,
        usedPoints: number | undefined,
    ): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();

        if (token) {
            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/orderWAccount`, {
                method: "POST",
                headers: { ...headers, authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    cartItem: cartItems,
                    adressData: adressData,
                    usedPoints: usedPoints,
                }),
            });

            if (!response.ok) {
                console.error(response);
            }
        } else {
            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/order`, {
                method: "POST",
                body: JSON.stringify({
                    cartItem: cartItems,
                    adressData: adressData,
                    usedPoints: usedPoints,
                }),
            });

            if (!response.ok) {
                console.error(response);
            }
        }
    }

    public async retrieveOrders(): Promise<Order[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/history`, {
            method: "GET",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as Order[];
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
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/games`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

    public async getFeaturedItems(): Promise<OrderItem[] | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems/featured`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

    public async getOneGame(id: number): Promise<OrderItem | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderitems/${id}`, {
            method: "GET",
        });
        if (response.ok) {
            return response.json() as Promise<OrderItem>;
        } else {
            console.error("Failed to fetch game data:", response.statusText);
            return undefined;
        }
    }
}

import { UserLoginFormModel } from "@shared/formModels/UserLoginFormModel";
import { UserRegisterFormModel } from "@shared/formModels/UserRegisterFormModel";
import { TokenService } from "./TokenService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItem } from "@shared/types";
import { UserData } from "@shared/types";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

/**
 * Handles user related functionality
 */
export class UserService {
    private _tokenService: TokenService = new TokenService();

    /**
     * Handles user login
     *
     * @param formData - Data to use during login
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async login(formData: UserLoginFormModel): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}auth/login`, {
            method: "post",
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        const json: { access_token: string | undefined } = await response.json();

        if (json.access_token) {
            this._tokenService.setToken(json.access_token);

            return true;
        }

        return false;
    }

    /**
     * Handles user registration
     *
     * @param formData - Data to use during registration
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async register(formData: UserRegisterFormModel): Promise<boolean> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}auth/register`, {
            method: "post",
            headers: headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error(response);

            return false;
        }

        return true;
    }

    public async confirmEmail(token: string): Promise<string> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}auth/confirmEmail/${token}`, {
            method: "POST",
        });

        // eslint-disable-next-line @typescript-eslint/typedef
        const responseData = await response.json();

        if (!response.ok) {
            console.error(response);
            return responseData.message;
        }

        return responseData.message;
    }

    /**
     * Handles user welcome message containing user and cart data. Requires a valid token.
     *
     * @returns Object with user and cart data when successful, otherwise `undefined`.
     */
    public async getWelcome(): Promise<UserHelloResponse | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/hello`, {
            method: "get",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as UserHelloResponse;
    }

    //gets all users from db
    public async getUsers(): Promise<UserData[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        const responses: Response = await fetch(`${viteConfiguration.API_URL}auth/getUsers`, {
            method: "get",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!responses.ok) {
            console.error(responses);

            return undefined;
        }

        return (await responses.json()) as UserData[];
    }

    //deletes a user based on id
    public async deleteFun(id: number): Promise<void> {
        const confirmed: any = confirm("Are you sure you want to delete user " + id + "?");
        if (confirmed) {
            const token: string | undefined = this._tokenService.getToken();
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/${id}`, {
                method: "DELETE",
                headers: { ...headers, authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error(response);
            }
        }
    }

    //updates a auth based on id
    public async updateFun(userId: number, newAuthorizationLevel: string): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/update/${userId}`, {
            method: "POST",
            headers: { ...headers, authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ authorizationLevel: newAuthorizationLevel }),
        });

        if (!response.ok) {
            console.error(response);
        }
        alert(
            "User " + userId + " authorization level updated successfully to " + newAuthorizationLevel + ".",
        );
    }

    /**
     * Handles adding an order item to the cart of the current user. Requires a valid token.
     *
     * @returns Current number of order items in the cart when successful, otherwise `false`.
     */
    public async addOrderItemToCart(id: number): Promise<CartItem[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/${id}`, {
            method: "post",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response.body);

            return undefined;
        }

        return (await response.json()) as CartItem[];
    }

    /**
     * Handles removing an order item from the cart of the current user. Requires a valid token.
     *
     * @returns Current number of order items in the cart when successful, otherwise `false`.
     */
    public async removeOrderItemFromCart(id: number): Promise<CartItem[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/${id}`, {
            method: "delete",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response.body);

            return undefined;
        }

        return (await response.json()) as CartItem[];
    }

    /**
     * Handles setting the amount of an order item in the cart of the current user. Requires a valid token.
     *
     * @returns Current number of order items in the cart when successful, otherwise `false`.
     */
    public async setCartItemAmount(id: number, amount: number): Promise<CartItem[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/${id}/${amount}`, {
            method: "post",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response.body);

            return undefined;
        }

        return (await response.json()) as CartItem[];
    }

    public async setSavedPointsAmount(amount: number): Promise<void> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        await fetch(`${viteConfiguration.API_URL}users/setSavedPoints/${amount}`, {
            method: "post",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });
    }
}

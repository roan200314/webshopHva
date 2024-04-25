import { Address } from "@shared/types";
import { TokenService } from "./TokenService";
import { SetAddressModel } from "@shared/formModels/SetAddressModel";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

export class AddressService {
    private _tokenService: TokenService = new TokenService();

    public async getAddressForUser(): Promise<Address | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}address/get`, {
            method: "get",
            headers: { ...headers, authorization: `Bearer ${token}` },

        });

        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as Address;
    }

    public async setAddressForUser(formData: SetAddressModel): Promise<Address | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        const response: Response = await fetch(`${viteConfiguration.API_URL}address/set`, {
            method: "post",
            headers: { ...headers, authorization: `Bearer ${token}` },
            body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
            console.error(response);

            return undefined;
        }

        return (await response.json()) as Address;
    }
}
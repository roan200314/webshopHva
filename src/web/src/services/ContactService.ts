import { TokenService } from "./TokenService";
import { ContactEmail } from "@shared/types/ContactEmail";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

export class ContactService {
    private _tokenService: TokenService = new TokenService();

    public async sendContactEmail(contactEmail: ContactEmail): Promise<Response> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }

        return await fetch(`${viteConfiguration.API_URL}contact/send`, {
            method: "post",
            headers: { ...headers, authorization: `Bearer ${token}` },
            body: JSON.stringify(contactEmail),
        });
    }
}

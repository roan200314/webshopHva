import { Games } from "@shared/types/games";
import { TokenService } from "./TokenService";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

/**
 * Handles game related functionality
 */
export class GameService {
    private _tokenService: TokenService = new TokenService();

    // gets all games from db
    public async getGames(): Promise<Games[] | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}games/getAll`, {
            method: "get",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as Games[];
    }

    // Example delete function for games
    public async deleteGameFunction(id: number): Promise<void> {
        const confirmed: any = confirm("Are you sure you want to delete user " + id + "?");
        if (confirmed) {
            const response: Response = await fetch(`${viteConfiguration.API_URL}games/${id}`, {
                method: "delete",
            });

            if (!response.ok) {
                console.error(response);
            }
        }
    }
}

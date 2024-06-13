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

    // Search game by name
    public async searchGameByName(title: string): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}games/search/${title}`, {
            method: "get",
            headers: { ...headers, authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        const game: Games = await response.json();
        console.log(game.id);
        return game.id;
    }

    // Example delete function for games
    public async deleteGameFunction(id: number): Promise<void> {
        const confirmed: any = confirm("Are you sure you want to delete game " + id + "?");
        if (confirmed) {
            const response: Response = await fetch(`${viteConfiguration.API_URL}games/${id}`, {
                method: "delete",
            });

            if (!response.ok) {
                console.error(response);
            }
            location.reload();
        }
    }
}

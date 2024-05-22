import { LitElement, html, TemplateResult, css } from "lit";
import { customElement } from "lit/decorators.js";  // Correct path
import { GameService } from "../services/GameService";
import { Games } from "@shared/types/games";

@customElement("game-item-search")
export class GameItemSearch extends LitElement {
    public static styles = css`
        .search-item-bar {
            padding: 10px;
            font-size: 1em;
            width: 90%;
        }
    `;

    private _gameService: GameService = new GameService();


    /**
     * Renders the search bar for game items
     * @returns {TemplateResult}
     */
    public render(): TemplateResult {
        return html`
            <form @submit=${this.searchGameItemByName}>
                <input type="text" class="search-item-bar" placeholder="Search for a game by name" />
                <button type="submit">Search</button>
            </form>
        `;
    }

    /**
     * Retrieves all game items
     */
    private async getAllGameItems(): Promise<void> {
        const result: Games[] | undefined = await this._gameService.getGames();
        if (result) {
            const gameItemsElement: any = document.querySelector("game-items");
            if (gameItemsElement) {
                gameItemsElement.gameItems = result;
            }
        } else {
            alert("Could not fetch all game items");
        }
    }

    /**
     * Searches for a game item by name and displays the result
     * @param event
     */
    private async searchGameItemByName(event: Event): Promise<void> {
        event.preventDefault();
        const nameInput: HTMLInputElement | null = this.shadowRoot?.querySelector(".search-item-bar") || null;
        if (nameInput) {
            const name: string = nameInput.value.trim();
            if (name === "") {
                // If the search input is empty, fetch all game items
                await this.getAllGameItems();
                return;
            }

            const response: Response = await fetch(`${viteConfiguration.API_URL}games/search/${name}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const gameItems: Games[] = await response.json();
                const gameItemsElement: any = document.querySelector("game-items");
                if (gameItemsElement) {
                    gameItemsElement.gameItems = gameItems;
                }
            } else {
                alert("Could not get game items");
            }
        }
    }
}

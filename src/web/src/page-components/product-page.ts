import { LitElement, TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";
import { GameService } from "../services/GameService";
import { Games } from "@shared/types/games";

/**
 * Aangepast element gebaseerd op Lit voor de header van de webshop.
 *
 * @todo De meeste logica in dit component is te simpel. Je moet het grootste deel vervangen door echte implementaties.
 */
const currentURL: string = window.location.href;
const IdOphalen: URL = new URL(currentURL);
const id: any | null = IdOphalen.searchParams.get("id");

@customElement("game-item-root")
export class GamePage extends LitElement {
    private _getGamesService: GameService = new GameService();
    private gameData: Games | undefined;

    public connectedCallback(): void {
        super.connectedCallback();
        void this.getGameItem();
    }

    public render(): TemplateResult {
        if (!this.gameData) {
            return html`<p>Loading...</p>`;
        }
        return this.renderGameItem(this.gameData);
    }

    private async getGameItem(): Promise<void> {
        if (!id) {
            console.error("No ID found in URL");
            return;
        }
        try {
            const result: Games | undefined = await this._getGamesService.getOneGame(id);
            this.gameData = result;
            this.requestUpdate();
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    }

    private renderGameItem(game: Games): TemplateResult {
        const gameText: string = game.descriptionMarkdown && game.descriptionMarkdown.length > 100 ? game.descriptionMarkdown.substring(0, 100) + "..." : game.descriptionMarkdown;
        const imageURL: string = game.images && game.images.length > 0 ? game.images[0] : "";
        return html`
            <div class="product">
                <h3>${game.title}</h3>
                <img class="gameFoto" src="${imageURL}" alt="${game.authors}">
                <p>${gameText}</p>
                <div class="buttons">
                    <span class="base-price">€ ${game.price}</span>
                    <button class="add-to-cart-button">In cart</button>
                </div>
            </div>
        `;
    }
}
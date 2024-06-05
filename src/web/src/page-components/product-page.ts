import { LitElement, TemplateResult, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { GameService } from "../services/GameService";
import { Games } from "@shared/types/games";

@customElement("game-item-root")
export class GamePage extends LitElement {
    private _getGamesService: GameService = new GameService();
    private gameData: Games | undefined;
    private id: number | null = null;

    public static styles = css`
        :host {
            display: block;
            padding: 16px;
            font-family: Arial, sans-serif;
        }
        .product {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 600px;
            margin: 0 auto;
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .product img {
            max-width: 100%;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        .product h3 {
            margin: 0 0 16px;
            font-size: 24px;
            color: #333;
        }
        .product p {
            font-size: 16px;
            color: #666;
            margin: 0 0 16px;
            text-align: center;
        }
        .buttons {
            display: flex;
            justify-content: space-between;
            width: 100%;
            align-items: center;
        }
        .base-price {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        .add-to-cart-button {
            padding: 8px 16px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .add-to-cart-button:hover {
            background-color: #0056b3;
        }
    `;

    public connectedCallback(): void {
        super.connectedCallback();
        this.id = this.getIdFromURL();
        if (this.id !== null) {
            void this.getGameItem();
        } else {
            console.error("No ID found in URL");
        }
    }

    public render(): TemplateResult {
        if (!this.gameData) {
            return html`<p>Loading...</p>`;
        }
        return this.renderGameItem(this.gameData);
    }

    private getIdFromURL(): number | null {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get("id");
        return id ? Number(id) : null;
    }

    private async getGameItem(): Promise<void> {
        if (this.id === null) {
            console.error("No ID found in URL");
            return;
        }
        try {
            const result: Games | undefined = await this._getGamesService.getOneGame(this.id);
            if (result) {
                this.gameData = result;
                this.requestUpdate();
            } else {
                console.error("No game data found");
            }
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    }

    private renderGameItem(game: Games): TemplateResult {
        const imageURL: string = game.images && game.images.length > 0 ? game.images[0] : "";
        return html`
            <div class="product">
                <h3>${game.title}</h3>
                <img class="gameFoto" src="${imageURL}" alt="${game.authors}">
                <p>${game.descriptionMarkdown}</p>
                <div class="buttons">
                    <span class="base-price">€${game.price}</span>
                    <button class="add-to-cart-button">Add to cart</button>
                </div>
            </div>
        `;
    }
}

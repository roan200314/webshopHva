import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GameService } from "../services/GameService";
import { Games } from "@shared/types/games";

@customElement("game-items")
export class GameItems extends LitElement {
    public static styles = css`
        .product-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 20px 0;
        }

        .product {
            background-color: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .product img {
            width: 100%;
            height: auto;
        }

        .buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }

        .more-info-button,
        .add-to-cart-button {
            padding: 5px 10px;
            background-color: #f0c040;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 5px;
        }

        .base-price {
            font-weight: bold;
            color: #333;
        }

        .gameFoto {
            max-width: 300px;
        }
    `;

    private _gameService: GameService = new GameService();

    @property({ type: Array })
    public games: Games[] = [];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getGamesItems();
    }

    private async getGamesItems(): Promise<void> {
        try {
            const result: Games[] | undefined = await this._gameService.getGames();
            if (result) {
                this.games = result;
                console.log("Games fetched successfully:", this.games);
            } else {
                console.error("Could not fetch games");
            }
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    }

    private renderGameItem(game: Games): TemplateResult {
        const gameText: any = game.descriptionHtml && game.descriptionHtml.length > 100 ? game.descriptionHtml.substring(0, 100) + "..." : game.descriptionMarkdown;
        const imageURL: any = game.images && game.images.length > 0 ? game.images[0] : "";
        return html`
            <div class="product">
                <h3>${game.title}</h3>
                <img class="gameFoto" src="${imageURL}" alt="${game.authors}">
                <p>${gameText}</p>
                <div class="buttons">
                    <span class="base-price">€ ${game.authors}</span>
                    <button class="add-to-cart-button">In cart</button>
                </div>
            </div>
        `;
    }

    public render(): TemplateResult {
        return html`
            <section class="product-section" id="product-section">
                ${this.games.map(game => this.renderGameItem(game))}
            </section>
        `;
    }
}

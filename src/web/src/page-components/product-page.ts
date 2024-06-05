import { LitElement, TemplateResult, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { Games } from "@shared/types/games";
import { OrderItemService } from "../services/OrderItemService";
import { OrderItem } from "@shared/types";

@customElement("game-item-root")
export class GamePage extends LitElement {
    private _getOrderItem: OrderItemService = new OrderItemService();
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
            max-width: 800px;
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
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            align-items: center;
        }
        .base-price {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 16px;
        }
        .add-to-cart-button {
            padding: 12px 24px;
            font-size: 18px;
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
        .orderText {
            font-size: 14px;
            color: #333;
            margin-top: 16px;
            text-align: center;
        }
        .price-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 16px;
        }
        .old-price {
            font-size: 18px;
            color: #666;
            text-decoration: line-through;
            margin-bottom: 8px;
        }
        .discount {
            font-size: 18px;
            color: red;
            margin-bottom: 8px;
        }
        .delivery-info {
            font-size: 14px;
            color: green;
            margin-top: 8px;
            text-align: center;
        }
        .stock-status {
            font-size: 14px;
            color: green;
            margin-top: 8px;
            text-align: center;
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
            const result: OrderItem | undefined = await this._getOrderItem.getOneGame(this.id);
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

    private renderGameItem(game: OrderItem): TemplateResult {
        const imageURL: string = game.imageURLs && game.imageURLs.length > 0 ? game.imageURLs[0] : "";
        const oldPrice: string = 2 * game.price;
        return html`
            <div class="product">
                <h3>${game.name}</h3>
                <img class="gameFoto" src="${imageURL}" alt="${game.id}">
                <p>${game.description}</p>
                <div class="price-info">
                    <div class="old-price">€${oldPrice}</div>
                    <div class="discount">Super high discount!</div>
                    <div class="base-price">€${game.price}</div>
                </div>
                <div class="delivery-info">delivery price is included, only with LucaStars</div>
                <div class="stock-status">in stock</div>
                <button class="add-to-cart-button">In cart</button>
                <div class="orderText">                   
                ✓Collection from a LucaStars collection point possible<br>
                ✓30 days' reflection period and free returns<br>
                ✓Day and night customer service
                </div>
            </div>
        `;
    }
}

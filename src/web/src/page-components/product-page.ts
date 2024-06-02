import { LitElement, TemplateResult, html, render } from "lit";
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
export class gamePage extends LitElement {


    private _getGamesService: GameService = new GameService();

    public async connectedCallback(): Promise<void>  {
        super.connectedCallback();

        await this.getGameItem();
    }

    /**
     * Render de componenten
     */
    protected render(): TemplateResult {
        return html``;
    }

    private async getGameItem(): Promise<void> {
        const result: Games[] | undefined = await this._getGamesService.getOneGame(id);
        
        const gameTable: HTMLTableSectionElement | null = document.querySelector(
            "game-item-root",
        ) as HTMLTableSectionElement;
        if (!gameTable) return;

        result.forEach((gamedata) => {
            const row: HTMLTableRowElement = document.createElement("tr");

            render(
                html`
                    <td>${gamedata.id}</td>
                    <td>${gamedata.title}</td>
                    <td><img src="${gamedata.thumbnail}" alt="${gamedata.title}" width="100" /></td>
                    <td>${gamedata.descriptionMarkdown}</td>
                    <td>€${gamedata.price}</td>
                `,
                row,
            );

            gameTable.appendChild(row);
            console.log("data gevonden");
        });
    }
}
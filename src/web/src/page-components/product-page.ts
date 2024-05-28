import { LitElement } from "lit";
import { customElement } from "lit/decorators";
import { GameService } from "../services/GameService";

/**
 * Aangepast element gebaseerd op Lit voor de header van de webshop.
 *
 * @todo De meeste logica in dit component is te simpel. Je moet het grootste deel vervangen door echte implementaties.
 */
@customElement("game-item-root")
export class gamePage extends LitElement {
    

    private _getGamesService: GameService = new GameService();
}
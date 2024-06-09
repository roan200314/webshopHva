import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserData } from "@shared/types";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserService } from "../services/UserService";

@customElement("account-page")
export class AccountPage extends LitElement {

    public static styles = css`
        .title {
            color: #ecae20;
            text-align: center;
            margin: 3%;

        }
    `;

    private userService: UserService = new UserService();

    @state()
    private userData: UserData | undefined;

    @state()
    private name: string | undefined;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getWelcome();
    }

    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this.userService.getWelcome();
        this.userData = result?.user;       

        if(result){
            this.name = this.userData?.name;
        }
    }

    protected render(): TemplateResult {
        return html`
            <h1 class="title">Account Page of ${this.name}</h1>
        `;
    }
}

      


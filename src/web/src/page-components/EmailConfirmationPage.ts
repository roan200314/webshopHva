import { UserService } from "../services/UserService";
import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement, TemplateResult } from "lit";

@customElement("email-confirmation-page")
export class EmailConfirmationComponent extends LitElement {
    private userService: UserService = new UserService();

    @state()
    private done: boolean = false;

    @state()
    private statusMessage: string | undefined;

    public static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: Arial, sans-serif;
        }

        h1 {
            animation: appear 2s;
        }

        .message-loading {
            display: none;
            margin-top: 20px;
            animation: appear 2s;
        }

        .message-status {
            margin-top: 20px;
            animation: appear 2s 0.5s both;
        }

        .done .message-loading {
            display: none;
        }

        .done .message-status {
            display: block;
        }

        @keyframes appear {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        this.render();

        await this.confirmEmail();
    }

    private async confirmEmail(): Promise<void> {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const token: string | null = urlParams.get("token");

        if (!token) {
            this.statusMessage = "No token found in URL.";
            this.done = true;
            return;
        }

        this.statusMessage = await this.userService.confirmEmail(token);
        this.done = true;
    }

    public render(): TemplateResult {
        return html`
            <h1>Email Confirmation</h1>
            <p class="message-loading">${this.done ? "" : "Trying to confirm your email."}</p>
            <p class="message-status">${this.statusMessage}</p>
        `;
    }
}

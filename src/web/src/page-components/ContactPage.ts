import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement, TemplateResult } from "lit";
import { UserService } from "../services/UserService";
import { ContactService } from "../services/ContactService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { ContactEmail } from "@shared/types/ContactEmail";

@customElement("contact-page")
export class ContactPage extends LitElement {
    private userService: UserService = new UserService();
    private contactService: ContactService = new ContactService();

    @property({ type: String })
    private emailTitle: string = "";

    @property({ type: String })
    private emailMessage: string = "";

    @property({ type: Number })
    private statusCode: number = 0;

    @property({ type: String })
    private statusMessage: string = "";

    public static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f2f5;
      font-family: 'Arial', sans-serif;
    }

    .contact-form-container {
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      margin-top: 0;
      text-align: center;
      color: #333;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    input,
    textarea {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    button {
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    button:hover {
      background-color: #0056b3;
    }

    .status-message {
      text-align: center;
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      font-weight: bold;
    }

    .status-success {
      background-color: #d4edda;
      color: #155724;
    }

    .status-error {
      background-color: #f8d7da;
      color: #721c24;
    }
  `;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.checkLoggedIn();
    }

    private async checkLoggedIn(): Promise<void> {
        const helloUserResponse: UserHelloResponse | undefined = await this.userService.getWelcome();

        if (!helloUserResponse) {
            location.href = "/";
        }
    }

    public render(): TemplateResult {
        return html`
    <div class="contact-form-container">
      <h2>Contact Us</h2>
      <form @submit="${this.handleSubmit}">
        <input type="text" id="title" name="emailTitle" placeholder="Title" .value="${this.emailTitle}" @input="${this.handleInputChange}">
      <textarea id="message" name="emailMessage" placeholder="Message" .value="${this.emailMessage}" @input="${this.handleInputChange}"></textarea>
      <button type="submit">Send Email</button>
    </form>
    ${this.statusMessage ? html`
      <div class="status-message ${this.statusCode === 200 ? "status-success" : "status-error"}">
        ${this.statusMessage}
      </div>
    ` : ""}
  </div>
    `;
    }

    private handleInputChange(event: Event): void {
        const target: HTMLInputElement | HTMLTextAreaElement = event.target as HTMLInputElement | HTMLTextAreaElement;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this[target.name] = target.value;
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        await this.sendEmail();
    }

    private async sendEmail(): Promise<void> {
        const contactEmail: ContactEmail = {
            title: this.emailTitle,
            message: this.emailMessage
        };

        const response: Response = await this.contactService.sendContactEmail(contactEmail);

        this.statusCode = response.status;
        // Define data here so we can reuse it inside conditions
        let data: any;
        if (response.ok) {
            this.statusMessage = "Email sent successfully";
        } else if(this.statusCode === 400) {
            // Parse the data and handle it
            data = await response.json();
            // Join array of messages into a single string
            this.statusMessage = data.message.join(", ");
        } else {
            // Handle other errors
            // eslint-disable-next-line @typescript-eslint/typedef
            data = await response.json();
            this.statusMessage = data.message;
        }
    }
}

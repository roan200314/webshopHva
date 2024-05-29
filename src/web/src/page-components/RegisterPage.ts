import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement, TemplateResult } from "lit";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { RegisterForm } from "../models/interfaces/AuthForms";

@customElement("register-page")
export class RegisterPage extends LitElement {
    public static styles = css`
        :host {
            font-family: "Roboto", sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #f6f9fc;
        }

        .user-form {
            width: 500px;
            padding: 30px;
            background: #ffffff;
            box-shadow: 0px 14px 32px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .user-form:hover {
            box-shadow: 0px 16px 40px rgba(0, 0, 0, 0.15);
        }

        .user-form label {
            font-size: 14px;
            font-weight: 500;
            color: #5c616a;
            margin-bottom: 10px;
            display: block;
        }

        .user-form input[type="text"],
        .user-form input[type="password"] {
            width: 100%;
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid #e0e7ee;
            border-radius: 5px;
            font-size: 16px;
        }

        .user-form button {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 5px;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .user-form button:hover {
            background: #0056b3;
        }
    `;

    @property() private userForm: RegisterForm = {
        name: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    };
    private tokenService = new TokenService();
    private userService = new UserService();

    public connectedCallback(): void {
        super.connectedCallback();
        this.checkIfAlreadyLoggedIn();
    }

    public render(): TemplateResult {
        return html`
            <form class="user-form" @submit=${this.handleSubmit}>
                ${Object.keys(this.userForm).map(this.renderField.bind(this))}
                <button>Register</button>
            </form>
        `;
    }

    private checkIfAlreadyLoggedIn(): void {
        const token: string | undefined = this.tokenService.getToken();
        if (token) {
            window.location.href = "/";
        }
    }

    private renderField(fieldName: string): TemplateResult {
        const capitalizedFieldName: string = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        return html`
            <label>
                ${capitalizedFieldName}
                <input
                    type="${fieldName === "password" ? "password" : "text"}"
                    .value="${this.userForm[fieldName as keyof RegisterForm]}"
                    @input=${(e: InputEvent): void => {
                        this.handleInputChange(fieldName, e);
                        return;
                    }}
                />
            </label>
        `;
    }

    private handleInputChange(inputKey: string, e: InputEvent): void {
        const { value } = e.target as HTMLInputElement;
        this.userForm = { ...this.userForm, [inputKey]: value };
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();

        await this.userService.register(this.userForm).then((registrationResult: boolean): void => {
            if (registrationResult) {
                alert("Successfully registered!");
                window.location.href = "/login.html";
            } else {
                alert("Registration failed!");
            }
        });
    }
}

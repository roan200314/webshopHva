import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ReviewService } from "../services/ReviewService";
import { UserData } from "@shared/types/UserData";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

@customElement("game-review")
export class GameReviewComponent extends LitElement {
    public static styles = css`
        :host {
            display: flex;
            max-width: 500px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        form {
            display: flex;
            flex-direction: column;
        }

        label {
            font-weight: bold;
            margin-bottom: 5px;
        }

        textarea, input[type="number"] {
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            width: 100%;
            box-sizing: border-box;
        }

        button {
            padding: 10px 15px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #0056b3;
        }

        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    `;

    private userService: UserService = new UserService();
    private reviewService = new ReviewService();
    private ids: number | null = null;
    private userId: number | null = null;

    @state()
    private userData: UserData | undefined;

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getUserInformation();
        this.ids = this.getIdFromURL();
        if (this.id !== null) {
            void this.render();
        } else {
            console.error("No ID found in URL");
        }
    }

    private getIdFromURL(): number | null {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get("id");
        return id ? Number(id) : null;
    }

    public render(): ReturnType<LitElement["render"]> {
        return html`
            <form @submit=${this.handleSubmit}>
                <label for="reviewContent">Review Content:</label><br>
                <textarea id="reviewContent" name="reviewContent" rows="4" cols="50" @input=${this.handleContentInput}></textarea><br>
                <label for="rating">Rating:</label><br>
                <input type="number" id="rating" name="rating" min="1" max="5" @change=${this.handleRatingChange}><br>
                <button type="submit">Submit</button>
            </form>
        `;
    }
    private async getUserInformation(): Promise<void> {
        const userInformation: UserHelloResponse | undefined = await this.userService.getWelcome();
        if (!userInformation || !userInformation.user) return;

        this.userData = userInformation?.user;
    }

    public handleSubmit(event: Event): void {
        this.reviewService.createReview(event, this.reviewContent, this.rating, this.userData?.id, this.ids).catch(err => console.error(err));
    }

    public handleContentInput(event: InputEvent): void {
        const target: any = event.target as HTMLTextAreaElement;
        this.reviewContent = target.value;
    }

    public handleRatingChange(event: Event): void {
        const target: any = event.target as HTMLInputElement;
        this.rating = parseInt(target.value);
    }

    private resetForm(): void {
        this.reviewContent = "";
        this.rating = 0;
    }

    private reviewContent: string = "";
    private rating: number = 0;


}

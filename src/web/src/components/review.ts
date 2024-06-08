import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ReviewService } from "../services/ReviewService";
import { UserData } from "@shared/types/UserData";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

@customElement("game-review")
export class GameReviewComponent extends LitElement {
    public static styles = css`
        /* Add your component's styles here */
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

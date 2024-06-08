import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { ReviewService } from "../services/ReviewService";

@customElement("game-review")
export class GameReviewComponent extends LitElement {
    public static styles = css`
        /* Add your component's styles here */
    `;

    private reviewService = new ReviewService();

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

    public handleSubmit(event: Event): void {
        this.reviewService.createReview(event, this.reviewContent, this.rating).catch(err => console.error(err));
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

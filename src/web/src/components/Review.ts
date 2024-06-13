import { LitElement, html, css, HTMLTemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ReviewService } from "../services/ReviewService";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { Review } from "@shared/types/review";

// Custom element decorator
@customElement("review-component")
export class ReviewComponent extends LitElement {
    // Definieer de CSS-styling voor het component
    public static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            max-width: 600px;
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

        textarea,
        input[type="number"] {
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

        .reviews {
            margin-top: 20px;
        }

        .review-item {
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
    `;

    // Service-instanties
    private userService: UserService = new UserService();
    private reviewService: ReviewService = new ReviewService();
    private orderId: number | null = null;
    private userId: number | null = null;

    @state()
    private reviews: Review[] = [];

    @state()
    private reviewContent: string = "";

    @state()
    private rating: number = 0;

    // Haal gebruikersinformatie op bij het laden van het component
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.getUserInformation();
        this.orderId = this.getIdFromURL();
        if (this.orderId !== null) {
            await this.fetchReviews();
        } else {
            console.error("No order ID found in URL");
        }
    }

    // Haal de game ID uit de URL
    private getIdFromURL(): number | null {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get("id");
        return id ? Number(id) : null;
    }

    // Haal de reviews op voor de game
    private async fetchReviews(): Promise<void> {
        if (this.orderId !== null) {
            try {
                this.reviews = await this.reviewService.getReviews(this.orderId);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        }
    }

    // Render de HTML voor het component
    public render(): HTMLTemplateResult {
        return html`
            <form @submit=${this.handleSubmit}>
                <label for="reviewContent">Review Content:</label><br />
                <textarea
                    id="reviewContent"
                    name="reviewContent"
                    rows="4"
                    cols="50"
                    .value=${this.reviewContent}
                    @input=${this.handleContentInput}
                ></textarea
                ><br />
                <label for="rating">Rating:</label><br />
                <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    .value=${this.rating}
                    @change=${this.handleRatingChange}
                /><br />
                <button type="submit">Submit</button>
            </form>
            <div class="reviews">
                ${this.reviews.map(
                    (review: Review) => html`
                        <div class="review-item">
                            <p><strong>User:</strong> ${review.username}</p>
                            <p><strong>Rating:</strong> ${review.rating}/5</p>
                            <p><strong>Content:</strong> ${review.content}</p>
                        </div>
                    `,
                )}
            </div>
        `;
    }

    // Haal gebruikersinformatie op van de server
    private async getUserInformation(): Promise<void> {
        const userInformation: UserHelloResponse | undefined = await this.userService.getWelcome();
        if (!userInformation || !userInformation.user) return;

        this.userId = userInformation.user.id;
    }

    // Verwerk het indienen van het reviewformulier
    public async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        try {
            if (this.orderId !== null && this.userId !== null) {
                await this.reviewService.createReview(
                    event,
                    this.reviewContent,
                    this.rating,
                    this.userId,
                    this.orderId,
                );
                this.resetForm();
                await this.fetchReviews(); // Vernieuw de reviews na het indienen
            }
        } catch (err) {
            console.error(err);
        }
    }



    // Verwerk de invoer van de reviewinhoud
    public handleContentInput(event: InputEvent): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.reviewContent = target.value;
    }

    // Verwerk de wijziging van de beoordeling
    public handleRatingChange(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this.rating = parseInt(target.value);
    }

    // Reset het formulier na het indienen
    private resetForm(): void {
        this.reviewContent = "";
        this.rating = 0;
    }
}

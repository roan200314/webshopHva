import { Review } from "@shared/types/review";
import { TokenService } from "./TokenService";

export class ReviewService {
    private _tokenService: TokenService = new TokenService();

    public async createReview(
        event: Event,
        reviewContent: string,
        rating: number,
        userId: number,
        orderItemId: number,
    ): Promise<void> {
        event.preventDefault();
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            alert("Authentication token is missing.");
            return;
        }

        const response: Response = await fetch(`${viteConfiguration.API_URL}reviews/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                content: reviewContent,
                rating: rating,
                userId: userId,
                orderItemId: orderItemId,
            }),
        });

        if (!response.ok) {
            const errorData: any = await response.json();
            console.error("Failed to create review", errorData);
            alert(`Could not create review: ${errorData.message}`);
        } else {
            alert("Review posted successfully");
        }
    }
    public async getReviews(orderItemId: number): Promise<Review[]> {
        const response: Response = await fetch(
            `${viteConfiguration.API_URL}reviews/getAll?orderItemId=${orderItemId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch reviews");
        }

        // eslint-disable-next-line @typescript-eslint/typedef
        const jsonData = await response.json();

        // Map the response to the shared type Review
        return jsonData.map((item: any) => ({
            id: item.id,
            content: item.content,
            rating: item.rating,
            userId: item.user.id,
            username: item.user.name,
        }));
    }
}

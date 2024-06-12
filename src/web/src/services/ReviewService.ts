import { Review } from "@shared/types/review";
import { TokenService } from "./TokenService";

export class ReviewService {
    private _tokenService: TokenService = new TokenService();

    public async createReview(event: Event, reviewContent: string, rating: number, userId: number, gameId: number): Promise<void> {
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
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                content: reviewContent,
                rating: rating,
                userId: userId,
                gameId: gameId,
            }),
        });

        if (!response.ok) {
            const errorData: any = await response.json();
            console.error("Failed to create review", errorData);
            console.log(reviewContent, rating, userId, gameId);
            alert(`Could not create review: ${errorData.message}`);
        } else {
            alert("Review posted successfully");
        }
    }
    public async getReviews(gameId: number): Promise<Review[]> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}reviews/getAll?gameId=${gameId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
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
            userId: item.user.id, // Assuming `user` is a object with `id`
            username: item.user.name, // Assuming `user` is a object with `name`
            gameId: item.game.id // Assuming `game` is a object with `id`
        }));
    }
}

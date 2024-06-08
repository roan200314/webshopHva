import { TokenService } from "./TokenService";


export class ReviewService {
    private _tokenService: TokenService = new TokenService();

    public async createReview(event: Event, reviewContent: string, rating: number): Promise<void> {
        event.preventDefault();
        const token: string | undefined = this._tokenService.getToken();
        const response: Response = await fetch(`${viteConfiguration.API_URL}reviews/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                content: reviewContent,
                rating: rating,
            }),
        });
        if (!response.ok) {
            alert("Could not create Review");
        } else {
            alert("Review posted successfully");
        }
    }
}

import { Controller, Post, Body, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ReviewService } from "src/Services/ReviewService";
import { CreateReviewDto } from "src/Models/Dto/Item/CreateReviewDto";
import { Review as ReviewType } from "@shared/types/review";
import { Review } from "src/Models/Entities/Review";
import { Public } from "src/Auth/Decorators/public.decorator";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewController {
    public constructor(private reviewService: ReviewService) {}

    @ApiBearerAuth()
    @Post("create")
    @ApiOperation({ summary: "Creates a new review" })
    @ApiResponse({ status: 201, description: "Review created" })
    public createReview(@Body() createReviewDto: CreateReviewDto): Promise<ReviewType> {
        return this.reviewService.createReview(createReviewDto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Gets all available reviews for the game" })
    @ApiResponse({ status: 200, description: "Successful retrieval of the reviews" })
    @Public()
    @Get("getAll")
    public async getReviews(@Query("gameId") gameId: number): Promise<Review[]> {
      return await this.reviewService.getReviews(gameId);
    }
}

import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ReviewService } from "src/Services/ReviewService";
import { CreateReviewDto } from "src/Models/Dto/Item/CreateReviewDto";
import { Review as ReviewType } from "@shared/types/review";

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
}

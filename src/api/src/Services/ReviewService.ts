import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "src/Models/Dto/Item/CreateReviewDto";
import { Review } from "src/Models/Entities/Review";
import { Review as ReviewType } from "@shared/types/review";

@Injectable()
export class ReviewService {
    private readonly logger = new Logger(ReviewService.name);

    public constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) {}

    public async createReview(createReviewDto: CreateReviewDto): Promise<ReviewType> {
        const review: Review = new Review();
        review.content = createReviewDto.content;
        review.rating = createReviewDto.rating;

        // Validate relationships
        if (!createReviewDto.userId || !createReviewDto.orderItemId) {
            this.logger.error("Validation failed: UserId or orderItemId is missing", createReviewDto);
            throw new Error("UserId and GameId are required");
        }

        // Assuming you have User and Games entities defined somewhere
        review.user = { id: createReviewDto.userId } as any;
        review.orderItem = { id: createReviewDto.orderItemId } as any;

        const savedReview: Review = await this.reviewRepository.save(review);

        // Map the entity to the shared type
        return this.mapToReviewType(savedReview);
    }

    private mapToReviewType(review: Review): ReviewType {
        return {
            username: "",
            id: review.id,
            content: review.content,
            rating: review.rating,
            userId: review.user.id,
            orderItemId: review.orderItem.id,
        };
    }
    public async getReviews(orderItemId: number): Promise<Review[]> {
        return await this.reviewRepository.find({
            where: { orderItem: { id: orderItemId } },
            relations: ["orderItem", "user"],
        });
    }
}

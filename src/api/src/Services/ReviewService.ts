import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReviewDto } from "src/Models/Dto/Item/CreateReviewDto";
import { Review } from "src/Models/Entities/Review";
import { Repository } from "typeorm";
import { Review as ReviewType } from "@shared/types/review";

@Injectable()
export class ReviewService {
    public constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) {}

    public async createReview(createReviewDto: CreateReviewDto): Promise<ReviewType> {
        const review: Review = new Review();
        review.content = createReviewDto.content;
        review.rating = createReviewDto.rating;
        const savedReview = await this.reviewRepository.save(review);
        
        // Map the entity to the shared type
        return this.mapToReviewType(savedReview);
    }

    private mapToReviewType(review: Review): ReviewType {
        return {
            id: review.id,
            content: review.content,
            rating: review.rating,
            userId: review.user.id,
            gameId: review.game.id, 
        };
    }
}

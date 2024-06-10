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
        if (!createReviewDto.userId || !createReviewDto.gameId) {
            this.logger.error('Validation failed: UserId or GameId is missing', createReviewDto);
            throw new Error('UserId and GameId are required');
        }

        // Assuming you have User and Games entities defined somewhere
        review.user = { id: createReviewDto.userId } as any;  
        review.game = { id: createReviewDto.gameId } as any;  

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
    public async getReviews(gameId: number): Promise<Review[]> {
        return await this.reviewRepository.find({
          where: { game: { id: gameId } },
          relations: ['game', 'user'],
        });
      }
}

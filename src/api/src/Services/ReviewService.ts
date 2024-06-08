import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReviewDto } from "src/Models/Dto/Item/CreateReviewDto";
import { Review } from "src/Models/Entities/Review";
import { Repository } from "typeorm";

@Injectable()
export class ReviewService {
    public constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) {}

    public async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
        const review: Review = new Review();
        review.content = createReviewDto.content;
        review.rating = createReviewDto.rating;
        return this.reviewRepository.save(review);
    }
}

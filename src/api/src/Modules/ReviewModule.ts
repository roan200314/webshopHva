import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewService } from "src/Services/ReviewService";
import { Review } from "src/Models/Entities/Review";
import { ReviewController } from "src/Controllers/ReviewController";

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}

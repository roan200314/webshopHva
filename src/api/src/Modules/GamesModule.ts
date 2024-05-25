import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Games } from "../Models/Entities/Games";
import { GamesService } from "../Services/GamesService";
import { GamesController } from "../Controllers/GamesController";
import { OrderItem } from "../Models/Entities/OrderItem";

@Module({
    imports: [TypeOrmModule.forFeature([OrderItem, Games])],
    providers: [GamesService],
    controllers: [GamesController],
    exports: [GamesService],
})
export class GamesModule {}

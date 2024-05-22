import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Games } from "../Models/Entities/Games";
import { GamesService } from "../Services/GamesService";
import { GamesController } from "../Controllers/GamesController";

@Module({
    imports: [TypeOrmModule.forFeature([Games])],
    providers: [GamesService],
    controllers: [GamesController],
    exports: [GamesService],
})
export class GamesModule {}

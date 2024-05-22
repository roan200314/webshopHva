import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Games } from "../Models/Entities/Games";

@Injectable()
export class GamesService {
    public constructor(
        @InjectRepository(Games)
        private gamesRepository: Repository<Games>,
    ) {}

    public async getAllGames(): Promise<Games[]> {
        return await this.gamesRepository.find();
    }

    public async massImport(games: Games[]): Promise<void> {
        await this.gamesRepository.save(games);
    }
}

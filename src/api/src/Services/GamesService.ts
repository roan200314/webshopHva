import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
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
    public async deleteGame(id: number) : Promise<{ message: string }> {
        await this.gamesRepository.delete(id);
        return { message: "Game removed successfully" };
    }

        /**
     * Searches for an order item by its name.
     * @param name - The name of the order item to search for.
     * @returns {Promise<Games[]>}
     */
        public async searchGameItemByName(name: string): Promise<Games[]> {
            return await this.gamesRepository.find({ where: { title: ILike(`%${name}%`) } });
        }
}

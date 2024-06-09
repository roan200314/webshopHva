import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Games } from "../Models/Entities/Games";
import { OrderItem } from "../Models/Entities/OrderItem";
import { OrderItemType } from "../Models/Enumerations/OrderItemType";

@Injectable()
export class GamesService {
    public constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Games)
        private gamesRepository: Repository<Games>,
    ) {
    }

    public async getAllGames(): Promise<Games[]> {
        return await this.gamesRepository.find();
    }

    public async massImport(games: Games[]): Promise<void> {
        const savedGames: Games[] = await this.gamesRepository.save(games);

        // For each saved game, create an order item
        const orderItems: OrderItem[] = savedGames.map(game => {
            return new OrderItem({
                name: game.title,
                description: game.descriptionMarkdown,
                price: 15,
                imageURLs: [game.thumbnail],
                game: game,
                itemType: OrderItemType.Game,
            });
        });

        // Save the order items
        await this.orderItemRepository.save(orderItems);
    }

    public async deleteGame(id: number): Promise<{ message: string }> {
        await this.gamesRepository.delete(id);
        return {message: "Game removed successfully"};
    }

    /**
     * Searches for an order item by its name.
     * @param name - The name of the order item to search for.
     * @returns {Promise<Games[]>}
     */
    public async searchGameItemByName(name: string): Promise<Games[]> {
        return await this.gamesRepository.find({where: {title: ILike(`%${name}%`)}});
    }

    
}

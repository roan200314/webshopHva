import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartItem } from "../Models/Entities/CartItem";

@Injectable()
export class CartItemService {
    public constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
    ) {
    }

    public async getCartItemNames(userId: number): Promise<string[]> {
        const userCartItems: CartItem[] = await this.cartItemRepository.find({
            where: {
                user: {id: userId}
            },
            relations: ["item"]
        });

        return userCartItems.map(cartItem => cartItem.item.name);
    }
}

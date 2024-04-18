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

    public async addOrderItemToCart(userId: number, orderItemId: number): Promise<number> {
        const cartItem: CartItem | undefined = await this.cartItemRepository.findOne({
            where: {
                user: {id: userId},
                item: {id: orderItemId}
            }
        });

        if (cartItem) {
            cartItem.amount += 1;
            await this.cartItemRepository.save(cartItem);

            return cartItem.amount;
        } else {
            await this.cartItemRepository.save({
                user: {id: userId},
                item: {id: orderItemId},
                amount: 1
            });

            return 1;
        }
    }
}

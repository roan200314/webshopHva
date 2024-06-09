import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartItem } from "../Models/Entities/CartItem";

@Injectable()
export class CartItemService {
    public constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
    ) {}

    public async getCartItems(userId: number): Promise<CartItem[]> {
        return await this.cartItemRepository.find({
            where: {
                user: { id: userId },
            },
            relations: ["item"],
        });
    }

    public async addOrderItemToCart(userId: number, orderItemId: number): Promise<CartItem[]> {
        const cartItem: CartItem | undefined = await this.cartItemRepository.findOne({
            where: {
                user: { id: userId },
                item: { id: orderItemId },
            },
        });

        if (cartItem) {
            cartItem.amount += 1;
            await this.cartItemRepository.save(cartItem);
        } else {
            await this.cartItemRepository.save({
                user: { id: userId },
                item: { id: orderItemId },
                amount: 1,
            });
        }

        return await this.getCartItems(userId);
    }

    public async removeOrderItemFromCart(userId: number, orderItemId: number): Promise<CartItem[]> {
        const cartItem: CartItem | undefined = await this.cartItemRepository.findOne({
            where: {
                user: { id: userId },
                item: { id: orderItemId },
            },
        });

        if (cartItem) {
            if (cartItem.amount > 1) {
                cartItem.amount -= 1;
                await this.cartItemRepository.save(cartItem);
            } else {
                await this.cartItemRepository.remove(cartItem);
            }
        }

        return await this.getCartItems(userId);
    }

    public async setCartItemAmount(userId: number, orderItemId: number, amount: number): Promise<CartItem[]> {
        const cartItem: CartItem | undefined = await this.cartItemRepository.findOne({
            where: {
                user: { id: userId },
                item: { id: orderItemId },
            },
        });

        if (cartItem) {
            if (amount > 0) {
                cartItem.amount = amount;
                await this.cartItemRepository.save(cartItem);
            } else {
                await this.cartItemRepository.remove(cartItem);
            }
        } else {
            await this.cartItemRepository.save({
                user: { id: userId },
                item: { id: orderItemId },
                amount: amount,
            });
        }

        return await this.getCartItems(userId);
    }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../Models/Entities/Order";
import { OrderItem } from "../Models/Entities/OrderItem";

@Injectable()
export class OrderService {
    public constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
    ) {}

    public async createOrder(order: Order): Promise<Order> {
        return await this.orderRepository.save(order);
    }

    public async getAllOrderItems(): Promise<OrderItem[]> {
        return await this.orderItemRepository.find();
    }

        /**
     * Deletes a order by their ID.
     *
     * @param {number} id - The ID of the order to delete.
     * @return {Promise<void>} - Returns a promise that resolves once the oreder is deleted.
     */
        public async deleteOrderById(id: number): Promise<{ message: string }> {
            await this.orderItemRepository.delete(id);
            return { message: "order removed successfully" };
        }
}

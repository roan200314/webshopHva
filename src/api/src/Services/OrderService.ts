import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../Models/Entities/Order";
import { OrderItem } from "../Models/Entities/OrderItem";
import { CreateOrderItemDto } from "../Models/Dto/Item/CreateOrderItemDto";

@Injectable()
export class OrderService {
    public constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
    ) {
    }
    /**
     * Creates an order item.
     * @param createOrderItemDto - DTO containing the order item details.
     * @returns {Promise<void>}
     */
    public async createOrder(createOrderItemDto: CreateOrderItemDto): Promise<void> {
        const orderItem: OrderItem = new OrderItem();
        orderItem.name = createOrderItemDto.name;
        orderItem.price = createOrderItemDto.price;
        orderItem.description = createOrderItemDto.description;
        await this.orderRepository.save(orderItem);
    }
    /**
     * Retrieves all available order items.
     * @returns {Promise<OrderItem[]>}
     */
    public async getAllOrderItems(): Promise<OrderItem[]> {
        return await this.orderItemRepository.find();
    }
    /**
     * Creates a new order item.
     * @param orderItem - The order item to create.
     * @returns {Promise<OrderItem>}
     */
    public async createOrderItem(orderItem: OrderItem): Promise<OrderItem> {
        return await this.orderItemRepository.save(orderItem);
    }

    /**
     * Retrieves an order item by its ID.
     * @param id - The ID of the order item to retrieve.
     * @returns {Promise<OrderItem>}
     */
    public async getOrderItemById(id: number): Promise<OrderItem> {
        return await this.orderItemRepository.findOne({ where: { id } });
    }

    /**
     * Deletes an order item by its ID.
     * @param id - The ID of the order item to delete.
     * @returns {Promise<void>}
     */
    public async deleteOrderItemById(id: number): Promise<void> {
        await this.orderItemRepository.delete(id);
    }
}
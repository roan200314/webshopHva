import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../Models/Entities/Order";
import { OrderItem } from "../Models/Entities/OrderItem";
import { CreateOrderItemDto } from "../Models/Dto/Item/CreateOrderItemDto";
import { CartItem, Address } from "@shared/types";
import { IsNull } from "typeorm";

@Injectable()
export class OrderService {
    public constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
    ) {}

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
        return await this.orderItemRepository.find({ where: { 
            order: IsNull()
         }});
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
    public async deleteOrderItemById(id: number): Promise<{ message: string }> {
        const orderItem: any = await this.orderItemRepository.findOne({ where: { id } });
        if (!orderItem) {
            return { message: "Order item not found" };
        }
        await this.orderItemRepository.delete(id);
        return { message: "Order removed successfully" };
    }

    /**
     * Updates an order item.
     * @param id - The ID of the order item to update.
     * @param orderItem - The updated order item.
     * @returns {Promise<OrderItem>}
     */
    public async updateOrderItem(id: number, orderItem: OrderItem): Promise<OrderItem> {
        // Retrieve the order item by its ID
        const orderToUpdate: any = await this.orderItemRepository.findOne({ where: { id } });

        // Check if the order item exists
        if (!orderToUpdate) {
            throw new Error("Order item not found");
        }
        // Update the order item
        await this.orderItemRepository.update(id, orderItem);
        return await this.orderItemRepository.findOne({ where: { id } });
    }

    public async order(body: any): Promise<void> {
        const addressData: Address = body.adressData;
        const cartItems:CartItem[] = body.cartItem;

        console.log(body);

        const newOrder: Order = new Order();
        newOrder.street = addressData.street;
        newOrder.city = addressData.city;
        newOrder.zip = addressData.zip;
        newOrder.country = addressData.country;
        newOrder.status = "complete";
        newOrder.email = "some@email.com";
        newOrder.name = "Harry";

        const savedOrder: any = await this.orderRepository.save(newOrder);

        for (const cartItem of cartItems) {
            for (let i: number = 0; i < cartItem.amount; i++) {
                const orderItem: any = new OrderItem();
                orderItem.order = savedOrder;
                orderItem.name = cartItem.item.name;
                orderItem.price = cartItem.item.price;
                orderItem.description = cartItem.item.description;

                await this.orderItemRepository.save(orderItem);
            }
        }
    }
}

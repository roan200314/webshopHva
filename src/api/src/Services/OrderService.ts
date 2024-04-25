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
}

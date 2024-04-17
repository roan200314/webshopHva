import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "../Services/OrderService";
import { Order } from "../Models/Entities/Order";
import { OrderItem } from "../Models/Entities/OrderItem";

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem])],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "../Services/OrderService";
import { Order } from "../Models/Entities/Order";
import { OrderItem } from "../Models/Entities/OrderItem";
import { OrderItemController } from "../Controllers/OrderItemController";
import { MailModule } from "./MailModule";

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem]), MailModule],
    providers: [OrderService],
    controllers: [OrderItemController],
    exports: [OrderService],
})
export class OrderModule {}

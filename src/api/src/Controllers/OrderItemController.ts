import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../Services/OrderService";
import { Public } from "../Auth/Decorators/public.decorator";
import { OrderItem } from "../Models/Entities/OrderItem";

@ApiTags("OrderItems")
@Controller("orderItems")
export class OrderItemController {
    public constructor(private orderService: OrderService) {
    }

    @Public()
    @Get("all")
    @ApiOperation({ summary: "Retrieves all available order items" })
    @ApiResponse({ status: 200, description: "Order Items" })
    public async getAllOrderItems(): Promise<OrderItem[]> {
        return this.orderService.getAllOrderItems();
    }

    @Public()
    @Post("create")
    @ApiOperation({ summary: "Creates a new order item" })
    @ApiResponse({ status: 201, description: "Order Item created" })
    public createOrderItem(@Body() orderItem: OrderItem): Promise<OrderItem> {
        return this.orderService.createOrderItem(orderItem);
    }
}

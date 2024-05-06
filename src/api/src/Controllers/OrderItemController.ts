import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../Services/OrderService";
import { Public } from "../Auth/Decorators/public.decorator";
import { OrderItem } from "../Models/Entities/OrderItem";

@ApiTags("OrderItems")
@Controller("orderItems")
export class OrderItemController {
    public constructor(private orderService: OrderService) {}

    @Public()
    @Get("all")
    @ApiOperation({ summary: "Retrieves all available order items" })
    @ApiResponse({ status: 200, description: "Order Items" })
    public async getAllOrderItems(): Promise<OrderItem[]> {
        return this.orderService.getAllOrderItems();
    }

    @ApiBearerAuth()
    @Post("create")
    @ApiOperation({ summary: "Creates a new order item" })
    @ApiResponse({ status: 201, description: "Order Item created" })
    public createOrderItem(@Body() orderItem: OrderItem): Promise<OrderItem> {
        return this.orderService.createOrderItem(orderItem);
    }

    @ApiBearerAuth()
    @Get(":id")
    @ApiOperation({ summary: "Retrieves an order item by its ID" })
    @ApiResponse({ status: 200, description: "Order Item" })
    public async getOrderItemById(@Param("id", ParseIntPipe) id: number): Promise<OrderItem> {
        return this.orderService.getOrderItemById(id);
    }

    @ApiBearerAuth()
    @Delete(":id")
    @ApiOperation({ summary: "Deletes an order item by its ID" })
    @ApiResponse({ status: 200, description: "Order Item deleted" })
    public async deleteOrderItemById(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
        return await this.orderService.deleteOrderItemById(id);
    }

    @ApiBearerAuth()
    @Post("update/:id")
    @ApiOperation({ summary: "Updates an order item by its ID" })
    @ApiResponse({ status: 200, description: "Order Item updated" })
    public async updateOrderItemById(
        @Param("id", ParseIntPipe) id: number,
        @Body() orderItem: OrderItem,
    ): Promise<OrderItem> {
        return this.orderService.updateOrderItem(id, orderItem);
    }
}

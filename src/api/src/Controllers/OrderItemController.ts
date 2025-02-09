import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../Services/OrderService";
import { Public } from "../Auth/Decorators/public.decorator";
import { OrderItem } from "../Models/Entities/OrderItem";
import { EmployeeOnly } from "../Auth/Decorators/employee.decorator";
import { Order } from "../Models/Entities/Order";

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

    @ApiOperation({ summary: "Retrieves order history" })
    @ApiResponse({ status: 200, description: "Successful retrieval of order history" })
    @ApiBearerAuth()
    @Get("history")
    public async getOrderHistory(@Request() req): Promise<Order[]> {
        return await this.orderService.retrieveOrder(req.user.id);
    }

    @Public()
    @Post("order")
    @ApiOperation({ summary: "Order" })
    @ApiResponse({ status: 200, description: "Order response" })
    public async orderWithoutAccount(@Body() body: any): Promise<void> {
        return this.orderService.order(body);
    }

    @ApiBearerAuth()
    @Post("orderWAccount")
    @ApiOperation({ summary: "Order" })
    @ApiResponse({ status: 200, description: "Order response" })
    public async orderWithAccount(@Body() body: any, @Request() req): Promise<void> {
        return this.orderService.order(body, req.user);
    }

    @ApiBearerAuth()
    @EmployeeOnly()
    @Post("create")
    @ApiOperation({ summary: "Creates a new order item" })
    @ApiResponse({ status: 201, description: "Order Item created" })
    public createOrderItem(@Body() orderItem: OrderItem): Promise<OrderItem> {
        return this.orderService.createOrderItem(orderItem);
    }

    @Public()
    @Get("merchandise")
    @ApiOperation({ summary: "Retrieves all available merchandise" })
    @ApiResponse({ status: 200, description: "Merchandise" })
    public async getMerchandise(): Promise<OrderItem[]> {
        return await this.orderService.getMerchandiseItems();
    }

    @Public()
    @Get("games")
    @ApiOperation({ summary: "Retrieves all available games" })
    @ApiResponse({ status: 200, description: "Games" })
    public async getGames(): Promise<OrderItem[]> {
        return await this.orderService.getGameItems();
    }

    @Public()
    @Get("featured")
    @ApiOperation({ summary: "Retrieves all featured items" })
    @ApiResponse({ status: 200, description: "Featured items" })
    public async getFeaturedItems(): Promise<OrderItem[]> {
        return await this.orderService.getFeaturedItems();
    }

    @ApiBearerAuth()
    @EmployeeOnly()
    @Post("featured/:id/:setFeatured")
    @ApiOperation({ summary: "Creates a new order item" })
    @ApiResponse({ status: 201, description: "Order Item created" })
    public async setOrderItemAsFeatured(
        @Param("id", ParseIntPipe) id: number,
        @Param("setFeatured") setFeatured: string,
    ): Promise<void> {
        const setFeaturedAsBool: boolean = setFeatured.toLowerCase() === "true";
        await this.orderService.setOrderItemAsFeatured(id, setFeaturedAsBool);
    }

    @Public()
    @Get(":id")
    @ApiOperation({ summary: "Retrieves an order item by its ID" })
    @ApiResponse({ status: 200, description: "Order Item" })
    public async getOrderItemById(@Param("id", ParseIntPipe) id: number): Promise<OrderItem> {
        return this.orderService.getOrderItemById(id);
    }

    @ApiBearerAuth()
    @EmployeeOnly()
    @Delete(":id")
    @ApiOperation({ summary: "Deletes an order item by its ID" })
    @ApiResponse({ status: 200, description: "Order Item deleted" })
    public async deleteOrderItemById(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
        return await this.orderService.deleteOrderItemById(id);
    }

    @ApiBearerAuth()
    @EmployeeOnly()
    @Post("update/:id")
    @ApiOperation({ summary: "Updates an order item by its ID" })
    @ApiResponse({ status: 200, description: "Order Item updated" })
    public async updateOrderItemById(
        @Param("id", ParseIntPipe) id: number,
        @Body() orderItem: OrderItem,
    ): Promise<OrderItem> {
        return this.orderService.updateOrderItem(id, orderItem);
    }

    @Public()
    @Get("search/:name")
    @ApiOperation({ summary: "Searches for an order item by its name" })
    @ApiResponse({ status: 200, description: "Order Item" })
    public async searchOrderItemByName(@Param("name") name: string): Promise<OrderItem[]> {
        return await this.orderService.searchOrderItemByName(name);
    }
    @Get("/:id")
    @ApiOperation({ summary: "Retrieves the game based on id" })
    @ApiResponse({ status: 200, description: "Game fetched" })
    public async fetchGame(@Param("id") id: number): Promise<OrderItem> {
        return await this.orderService.getGameItemById(id);
    }
}

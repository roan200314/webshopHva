import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../Services/OrderService";
import { Public } from "../Auth/Decorators/public.decorator";
import { OrderItem } from "../Models/Entities/OrderItem";
import { Delete, HttpCode, HttpStatus, Param} from "@nestjs/common";
import { ApiBearerAuth} from "@nestjs/swagger";

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

        // deletes order
        @HttpCode(HttpStatus.OK)
        @Delete("/:id")
        @ApiBearerAuth()
        @ApiOperation({ summary: "Deletes the order based on id" })
        @ApiResponse({ status: 200, description: "order deleted" })
        public async deleteOrder(@Param("id") id: number): Promise<{ message: string }> {
            return await this.orderService.deleteOrderById(id);
        }
}

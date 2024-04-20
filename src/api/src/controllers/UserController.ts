import { Controller, Get, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItemService } from "../Services/CartItemService";

@ApiTags("Users")
@Controller("users")
export class UserController {
    public constructor(private cartItemService: CartItemService) {
    }

    @ApiOperation({summary: "Get a welcome message for the user"})
    @ApiResponse({status: 200, description: "Successful retrieval of welcome message"})
    @ApiBearerAuth()
    @Get("hello")
    public async getWelcome(@Request() req): Promise<UserHelloResponse> {
        return {
            email: req.user.email,
            cartItems: await this.cartItemService.getCartItemNames(req.user.id),
        };
    }

    @ApiOperation({summary: "Add an order item to the user’s cart"})
    @ApiResponse({status: 200, description: "Total number of order items in the cart after adding the item"})
    @ApiParam({name: "id", description: "The id of the order item to add to the cart"})
    @ApiBearerAuth()
    @Post("cart/:id")
    public async addOrderItemToCart(
        @Request() req,
        @Param("id") id: number
    ): Promise<number> {
        return await this.cartItemService.addOrderItemToCart(req.user.id, id);
    }
}

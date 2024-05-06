import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItemService } from "../Services/CartItemService";
import { CartItem } from "@shared/types";
import { UserService } from "../Services/UserService";
import { AdminOnly } from "../Auth/Decorators/admin.decorator";

@ApiTags("Users")
@Controller("users")
export class UserController {
    public constructor(
        private cartItemService: CartItemService,
        private userService: UserService,
    ) {}

    // deletes user
    @HttpCode(HttpStatus.OK)
    @Delete("/:id")
    @ApiBearerAuth()
    @AdminOnly()
    @ApiOperation({ summary: "Deletes the user based on id" })
    @ApiResponse({ status: 200, description: "User deleted" })
    public async deleteUser(@Param("id") id: number): Promise<{ message: string }> {
        return await this.userService.deleteUserById(id);
    }

    // gets name, cart items and email
    @ApiOperation({ summary: "Get a welcome message for the user" })
    @ApiResponse({ status: 200, description: "Successful retrieval of welcome message" })
    @ApiBearerAuth()
    @Get("hello")
    public async getWelcome(@Request() req): Promise<UserHelloResponse> {
        return {
            user: req.user,
            cartItems: await this.cartItemService.getCartItems(req.user.id),
            email: req.user.email,
        };
    }

    @ApiOperation({ summary: "Add an order item to the user’s cart" })
    @ApiResponse({
        status: 200,
        description: "Total number of order items in the cart after adding the item",
    })
    @ApiParam({ name: "id", description: "The id of the order item to add to the cart" })
    @ApiBearerAuth()
    @Post("cart/:id")
    public async addOrderItemToCart(@Request() req, @Param("id") id: number): Promise<CartItem[]> {
        return await this.cartItemService.addOrderItemToCart(req.user.id, id);
    }
}

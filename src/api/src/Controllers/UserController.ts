import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItemService } from "../Services/CartItemService";
import { AuthorizationLevel, CartItem } from "@shared/types";
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

    @HttpCode(HttpStatus.OK)
    @Post("update/:id")
    @ApiBearerAuth()
    @AdminOnly()
    @ApiOperation({ summary: "Updates the user's authorization level based on ID" })
    @ApiResponse({ status: 200, description: "User's authorization level updated" })
    public async updateUser(
        @Param("id") id: number,
        @Body() updateData: { authorizationLevel: AuthorizationLevel },
    ): Promise<{ message: string }> {
        await this.userService.updateAuthenticationLevelById(id, updateData.authorizationLevel);
        return { message: "User " + id + " authorization level updated successfully" };
    }

    @HttpCode(HttpStatus.OK)
    @Post("setSavedPoints/:amount")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Updates the current users saved points" })
    @ApiResponse({ status: 200, description: "User's saved points updated" })
    public async updateSavedPoints(
        @Param("amount") amount: number,
        @Request() req,
    ): Promise<void> {
        await this.userService.setSavedPointsAmount(req.user.email, amount);
    }

    // gets name, cart items and email
    @ApiOperation({ summary: "Get a welcome message for the user" })
    @ApiResponse({ status: 200, description: "Successful retrieval of welcome message" })
    @ApiBearerAuth()
    @Get("hello")
    public async getWelcome(@Request() req): Promise<UserHelloResponse> {
        return {
            user: req.user,
            savedPoints: await this.userService.getSavedPoint(req.user.id),
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

    @ApiOperation({ summary: "Remove an order item from the user’s cart" })
    @ApiResponse({
        status: 200,
        description: "Total number of order items in the cart after removing the item",
    })
    @ApiParam({ name: "id", description: "The id of the order item to remove from the cart" })
    @ApiBearerAuth()
    @Delete("cart/:id")
    public async removeOrderItemFromCart(@Request() req, @Param("id") id: number): Promise<CartItem[]> {
        return await this.cartItemService.removeOrderItemFromCart(req.user.id, id);
    }

    @ApiOperation({ summary: "Set the amount of an order item in the user’s cart" })
    @ApiResponse({
        status: 200,
        description: "Total number of order items in the cart after setting the amount",
    })
    @ApiParam({ name: "id", description: "The id of the order item to set the amount for" })
    @ApiParam({ name: "amount", description: "The amount to set for the order item" })
    @ApiBearerAuth()
    @Post("cart/:id/:amount")
    public async setCartItemAmount(
        @Request() req,
        @Param("id") id: number,
        @Param("amount") amount: number,
    ): Promise<CartItem[]> {
        return await this.cartItemService.setCartItemAmount(req.user.id, id, amount);
    }
}

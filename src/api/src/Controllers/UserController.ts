import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItemService } from "../Services/CartItemService";
import { UserService } from "../Services/UserService";
import { UserDto } from "src/Models/Dto/User/UserDto";

@ApiTags("Users")
@Controller("users")
export class UserController {
    public constructor(
        private cartItemService: CartItemService,
        private userService: UserService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Delete("/:id")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Deletes the user based on id" })
    @ApiResponse({ status: 200, description: "User deleted" })
    public async deleteUser(@Param("id") id: number): Promise<{ message: string }> {
        return await this.userService.deleteUserById(id);
    }

    @HttpCode(HttpStatus.OK)
    @Post("update/:id")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Updates the user based on id" })
    @ApiResponse({ status: 200, description: "User updated" })
    public async updateUser(@Param("id") id: number, @Body() updateUserDto: UserDto): Promise<{ message: string }> {
        await this.userService.updateAuthenticationLevelById(id, updateUserDto);
        return { message: "User updated successfully" };
    }

    @ApiOperation({ summary: "Get a welcome message for the user" })
    @ApiResponse({ status: 200, description: "Successful retrieval of welcome message" })
    @ApiBearerAuth()
    @Get("hello")
    public async getWelcome(@Request() req): Promise<UserHelloResponse> {
        return {
            email: req.user.email,
            cartItems: await this.cartItemService.getCartItemNames(req.user.id),
            name: req.user.name,
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
    public async addOrderItemToCart(@Request() req, @Param("id") id: number): Promise<number> {
        return await this.cartItemService.addOrderItemToCart(req.user.id, id);
    }
}

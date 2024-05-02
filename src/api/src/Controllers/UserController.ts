import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItemService } from "../Services/CartItemService";
import { UserService } from "../Services/UserService";
import { AuthorizationLevel, UserData } from "@shared/types/UserData";

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
    @ApiOperation({ summary: "Deletes the user based on id" })
    @ApiResponse({ status: 200, description: "User deleted" })
    public async deleteUser(@Param("id") id: number): Promise<{ message: string }> {
        return await this.userService.deleteUserById(id);
    }


    // updates user
    @HttpCode(HttpStatus.OK)
    @Post("update/:id")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Updates the user's authorization level based on ID" })
    @ApiResponse({ status: 200, description: "User's authorization level updated" })
    public async updateUser(
        @Param("id") id: number,
        @Body() updateData: { authorizationLevel: string }, 
    ): Promise<{ message: string }> {
        const authorizationLevel: AuthorizationLevel = updateData.authorizationLevel as AuthorizationLevel;
        await this.userService.updateAuthenticationLevelById(id, authorizationLevel);
        return { message: "User " + id +" authorization level updated successfully" };
    }
    
    //gets user
    @ApiOperation({ summary: "Get user" })
    @ApiResponse({ status: 200, description: "got the user" })
    @ApiBearerAuth()
    @Get("user")
    public async getUser(@Request() req): Promise<UserData> {
        return {
            id: req.user.id,
            name: req.user.name,
            password: req.user.password,
            email: req.user.email,
            authorizationLevel: req.user.authorizationLevel,
            firstName: req.user.firstName,
            lastName: req.user.lastName,

        };
    }


// gets name, cart items and email
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


    //add item to cart
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

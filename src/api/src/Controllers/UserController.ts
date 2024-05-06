import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItemService } from "../Services/CartItemService";
import { UserService } from "../Services/UserService";

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

}

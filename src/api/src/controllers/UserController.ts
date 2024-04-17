import { Controller, Get, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { CartItemService } from "../Services/CartItemService";

@ApiTags("Users")
@Controller("users")
export class UserController {
    public constructor(private cartItemService: CartItemService) {
    }

    @HttpCode(HttpStatus.OK)
    @Get("hello")
    @ApiOperation({ summary: "Creates a custom welcome message" })
    @ApiResponse({ status: 200, description: "Welcome message" })
    @ApiBearerAuth()
    public async getWelcome(@Request() req): Promise<UserHelloResponse> {
        return {
            email: req.user.email,
            cartItems: await this.cartItemService.getCartItemNames(req.user.id),
        };
    }
}

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
    @ApiBearerAuth()
    @ApiOperation({ summary: "Retrieves basic welcome information" })
    @ApiResponse({ status: 200, description: "Welcome Information" })
    public async getWelcome(@Request() req): Promise<UserHelloResponse> {
        return {
            email: req.user.email,
            cartItems: await this.cartItemService.getCartItemNames(req.user.id),
        };
    }
}

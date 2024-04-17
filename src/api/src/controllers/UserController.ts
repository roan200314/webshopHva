import { Controller, Get, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("User")
@Controller("user")
export class UserController {
    public constructor() {
    }

    @HttpCode(HttpStatus.OK)
    @Get("hello")
    @ApiOperation({ summary: "Creates a custom welcome message" })
    @ApiResponse({ status: 200, description: "Welcome message" })
    @ApiBearerAuth()
    public getWelcome(@Request() req): string {
        return `Hello, ${req.user.name}!`;
    }
}

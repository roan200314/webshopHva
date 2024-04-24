import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDto } from "../Models/Dto/User/UserDto";
import { AuthService } from "../Services/AuthService";

@ApiTags("User Management")
@Controller("users")
export class GetUserController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    @ApiOperation({ summary: "Get all users" })
    @ApiResponse({ status: 200, description: "Array of users", type: UserDto, isArray: true })
    async getAllUsers(): Promise<UserDto[]> {
        return await this.authService.getAllUsers();
    }
}

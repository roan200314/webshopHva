import { Controller, Get, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDto } from "../Models/Dto/User/UserDto";
import { GetUserService } from "../Services/GetUserService";
import { AllUserFetch } from "@shared/responses/allUserFetch";

@ApiTags("User Management")
@Controller("users")
export class GetUserController {
    constructor(private readonly getUserService: GetUserService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    public async getWelcome(@Request() req): Promise<AllUserFetch> {
        return {
            email: req.user.email,
            name: req.user.name,
        };
    }

    @ApiOperation({ summary: "Get all users" })
    @ApiResponse({ status: 200, description: "Array of users", type: UserDto, isArray: true })
    async getAllUsers(): Promise<UserDto[]> {
        return await this.getUserService.getAllUsers();
    }
}

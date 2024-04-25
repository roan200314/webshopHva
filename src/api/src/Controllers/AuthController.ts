import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { AuthService } from "../Services/AuthService";
import { Public } from "../Auth/Decorators/public.decorator";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../Models/Dto/User/CreateUserDto";
import { LoginUserDto } from "../Models/Dto/User/LoginUserDto";
import { UserDto } from "../Models/Dto/User/UserDto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    public constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("login")
    @ApiOperation({ summary: "Login an existing user" })
    @ApiConsumes("application/json")
    @ApiResponse({ status: 200, description: "Logged in successfully." })
    @ApiBody({ type: LoginUserDto })
    public async signIn(
        @Body() loginUserDto: LoginUserDto,
    ): Promise<{ access_token: string; token_type: string }> {
        return await this.authService.signIn(loginUserDto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    @ApiConsumes("application/json")
    @ApiResponse({ status: 200, description: "User registered successfully." })
    @ApiBody({ type: CreateUserDto })
    public async register(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
        return await this.authService.register(createUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Get("getUsers")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Gets all users from the database" })
    @ApiConsumes("application/json")
    @ApiResponse({ status: 200, description: "Array of users" })
    public async getAll(): Promise<UserDto[]> {
        return await this.authService.getAll();
    }

    @HttpCode(HttpStatus.OK)
    @Get("profile")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Gets the profile of the current user" })
    @ApiResponse({ status: 200, description: "User profile" })
    public getProfile(@Request() req): string {
        return req.user;
    }
}

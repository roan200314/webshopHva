import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./UserService";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../Models/Dto/User/CreateUserDto";
import { LoginUserDto } from "../Models/Dto/User/LoginUserDto";
import { User } from "../Models/Entities/User";
import { UserDto } from "../Models/Dto/User/UserDto";
import { AuthorizationLevel } from "../Models/Enumerations/AuthorizationLevel";

/**
 * A service provides functionality for user authentication including registration and login.
 *
 * @category Services
 */
@Injectable()
export class AuthService {
    private readonly Logger: Logger;

    /**
     * Initialises a new instance of AuthService
     *
     * @param {UserService} usersService - An instance of UsersService.
     * @param {JwtService} jwtService - An instance of JwtService.
     */
    public constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ) {
        this.Logger = new Logger(AuthService.name);
    }

    /**
     * Authenticates a user and generate a bearer token.
     *
     * @param {LoginUserDto} loginUserDto - DTO containing the user's credentials.
     * @throws {UnauthorizedException} - When invalid credentials are provided
     * @returns {Promise<{access_token: string, token_type: string}>} - A Promise that resolves to an object consisting of a bearer token and its type.
     */
    public async signIn(loginUserDto: LoginUserDto): Promise<{ access_token: string; token_type: string }> {
        const loginResult: User = await this.usersService.loginUser(loginUserDto);

        if (loginResult) {
            const payload: { id: number; email: string; name: string; authorizationLevel: AuthorizationLevel } = {
                id: loginResult.id,
                email: loginResult.email,
                name: loginResult.name,
                authorizationLevel: loginResult.authorizationLevel,
            };

            this.Logger.log(`User ${loginResult.email} logged in successfully`);

            return {
                access_token: await this.jwtService.signAsync(payload),
                token_type: "Bearer",
            };
        } else {
            throw new UnauthorizedException("Invalid credentials");
        }
    }

    /**
     * Registers a new user.
     *
     * @param {CreateUserDto} createUserDto - DTO containing the user's registration details.
     * @throws {BadRequestException} - When a user with the same email already exists, or if the registration fails for another reason.
     * @returns {Promise<{message: string}>} - A Promise that resolves to a success message if the registration was successful.
     */
    public async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
        if (await this.usersService.checkIfUserExists(createUserDto.email)) {
            throw new BadRequestException("User already exists");
        }

        try {
            await this.usersService.registerUser(createUserDto);
        } catch (e) {
            this.Logger.error(`Failed to register user: ${createUserDto.email}`);
            throw new BadRequestException("Failed to register user");
        }

        this.Logger.log(`User ${createUserDto.email} registered successfully`);
        return { message: "User registered successfully" };
    }

    /**
     * Gets all the users.
     *
     * @returns {Promise<User[]>} - A Promise that resolves to an array of users.
     */
    public async getAll(): Promise<UserDto[]> {
        return await this.usersService.getAllUsers();
    }
}

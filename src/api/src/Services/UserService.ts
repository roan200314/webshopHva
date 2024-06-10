import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "../Models/Entities/User";
import { LoginUserDto } from "../Models/Dto/User/LoginUserDto";
import { CreateUserDto } from "../Models/Dto/User/CreateUserDto";
import { plainToClass } from "class-transformer";
import { UserDto } from "../Models/Dto/User/UserDto";
import { AuthorizationLevel } from "@shared/types";
import { EmailConfirmation } from "../Models/Entities/EmailConfirmation";
import { MailService } from "./MailService";
import * as crypto from "node:crypto";

/**
 * A service handles user related operations including registration and login.
 *
 * @category Services
 */
@Injectable()
export class UserService {
    /**
     * Initialization of UsersService class involves injecting a user's repository.
     *
     * @constructor
     * @param {Repository<User>} usersRepository - A repository to perform various operations on user data.
     * @param emailConfirmationRepository
     * @param mailService
     */
    public constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(EmailConfirmation)
        private emailConfirmationRepository: Repository<EmailConfirmation>,
        private readonly mailService: MailService,
    ) {}

    /**
     * Registers a new user in the database.
     *
     * @param {CreateUserDto} createUserDto - DTO containing new user's registration details.
     * @return {Promise<void>}
     */
    public async registerUser(createUserDto: CreateUserDto): Promise<void> {
        const user: User = new User();
        user.email = createUserDto.email;
        user.name = createUserDto.name;
        user.firstName = createUserDto.firstname;
        user.lastName = createUserDto.lastname;
        user.password = createUserDto.password;

        // Generate a hash of the password
        user.password = await this.generateHash(user.password);

        // Create and save the user object in the database
        await this.usersRepository.save(user);
    }

    public async generateEmailToken(email: string): Promise<string | null> {
        const user: User = await this.usersRepository.findOne({
            where: { email: email },
        });

        if (!user) {
            return null;
        }

        const token: string = crypto.randomUUID();

        const emailConfirmation: EmailConfirmation = new EmailConfirmation();
        emailConfirmation.user = user;
        emailConfirmation.confirmationToken = token;
        emailConfirmation.confirmed = false;
        user.emailConfirmation = emailConfirmation;

        await this.emailConfirmationRepository.save(emailConfirmation);
        await this.usersRepository.save(user);

        return token;
    }

    /**
     * Logs in a user.
     *
     * @param {LoginUserDto} loginUserDto - DTO containing the user's login details.
     * @return {Promise<User>} - Returns user representation if login is successful, null otherwise.
     */
    public async loginUser(loginUserDto: LoginUserDto): Promise<User> {
        const { email, password } = loginUserDto;
        // Find the user with the provided username
        const user: User = await this.usersRepository.findOne({
            where: { email: email },
        });

        // If no such user exists, return null
        if (!user) {
            return null;
        }

        // If the provided password matches the one on record, return the user
        if (await this.comparePassword(password, user.password)) {
            return user;
        } else {
            // If the password doesn't match, return null
            return null;
        }
    }

    public async confirmEmail(token: string): Promise<{ message: string; status: number }> {
        const emailConfirmation: EmailConfirmation = await this.emailConfirmationRepository.findOne({
            where: { confirmationToken: token },
            relations: ["user"],
        });

        if (!emailConfirmation) {
            throw new BadRequestException("Invalid token");
        }

        if (emailConfirmation.confirmed) {
            throw new BadRequestException("Email already confirmed");
        }

        emailConfirmation.confirmed = true;
        await this.emailConfirmationRepository.save(emailConfirmation);

        await this.mailService.confirmAccountRegistration(
            emailConfirmation.user.email,
            emailConfirmation.user.name,
        );

        return {
            message: "Email confirmed successfully",
            status: 200,
        };
    }

    /**
     * Finds a user using their email.
     *
     * @param {string} email - The email of the user to find.
     * @return {Promise<User | undefined>} - Returns user representation if user is found, undefined otherwise.
     */
    public async findOne(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email } });
    }

    /**
     * Finds a user using their ID.
     *
     * @param {number} id - The ID of the user to find.
     * @return {Promise<User | undefined>} - Returns user representation if user is found, undefined otherwise.
     */
    public async getUserById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    /**
     * Deletes a user by their ID.
     *
     * @param {number} id - The ID of the user to delete.
     * @return {Promise<void>} - Returns a promise that resolves once the user is deleted.
     */
    public async deleteUserById(id: number): Promise<{ message: string }> {
        await this.usersRepository.delete(id);
        return { message: "User removed successfully" };
    }

    public async updateAuthenticationLevelById(
        id: number,
        newAuthenticationLevel: AuthorizationLevel,
    ): Promise<{ message: string }> {
        const user: any = await this.usersRepository.findOne({ where: { id } });

        // Check if the user exists
        if (!user) {
            throw new Error("User not found");
        }
        // Update the authorization level
        user.authorizationLevel = newAuthenticationLevel;

        // Save the changes
        await this.usersRepository.save(user);

        return { message: "User " + user.id + " authorization level updated successfully" };
    }

    /**
     * Retrieves all users from the database.
     *
     * @return {Promise<UserDto[]>} - An array of user representation.
     */
    public async getAllUsers(): Promise<UserDto[]> {
        const users: User[] = await this.usersRepository.find();
        return users.map((user: User) => plainToClass(UserDto, user, { excludeExtraneousValues: true }));
    }

    /**
     * Checks whether a user with a certain email exists.
     *
     * @param {string} email - The email to check.
     * @return {Promise<boolean>} - Returns true if user exists, false otherwise.
     */
    public async checkIfUserExists(email: string): Promise<boolean> {
        const user: User = await this.usersRepository.findOne({
            where: { email },
        });
        return !!user;
    }

    /**
     * Generates a hash for a password.
     *
     * @private
     * @param {string} password - The password to hash.
     * @return {Promise<string>} - The hashed password.
     */
    private async generateHash(password: string): Promise<string> {
        // Generate the salt
        const saltRounds: number = 10;
        const salt: string = await bcrypt.genSalt(saltRounds);

        // Hash the password
        return await bcrypt.hash(password, salt);
    }

    /**
     * Compares a password with its hash.
     *
     * @private
     * @param {string} password - The plain text password.
     * @param {string} hash - The hashed password.
     * @return {Promise<boolean>} - Returns true if passwords match, false otherwise.
     */
    private async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}

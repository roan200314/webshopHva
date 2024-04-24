import { Injectable } from "@nestjs/common";
import { UserDto } from "../Models/Dto/User/UserDto";
import { UserRepository } from "../Repositories/UserRepository";

@Injectable()
export class GetUserService {
    constructor(private readonly userRepository: UserRepository) {}

    /**
     * Fetches all users from the data source.
     * @returns Promise<UserDto[]>: Array of user DTOs.
     */
    async getAllUsers(): Promise<UserDto[]> {
        // Assuming UserRepository has a method to fetch all users
        return await this.userRepository.getAllUsers();
    }

    /**
     * Fetches a user by their ID from the data source.
     * @param userId The ID of the user to fetch.
     * @returns Promise<UserDto | null>: The user DTO if found, otherwise null.
     */
    async getUserById(userId: number): Promise<UserDto | null> {
        // Assuming UserRepository has a method to fetch a user by ID
        return await this.userRepository.getUserById(userId);
    }

    /**
     * Fetches a user by their email from the data source.
     * @param email The email of the user to fetch.
     * @returns Promise<UserDto | null>: The user DTO if found, otherwise null.
     */
    async getUserByEmail(email: string): Promise<UserDto | null> {
        // Assuming UserRepository has a method to fetch a user by email
        return await this.userRepository.getUserByEmail(email);
    }

    // Add other methods as needed to interact with the user data source
}

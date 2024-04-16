import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

/**
 * Data transfer object (dto) for creating users.
 * This class uses class-validator for basic data validations.
 */
export class CreateUserDto {
    /**
     * The username of the user to be created.
     * IsNotEmpty decorator ensures that this value must be provided.
     * MinLength decorator ensures that the username must be at least four characters long.
     */
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @IsEmail()
    public email: string;

    /**
     * The password for the user to be created.
     * IsNotEmpty decorator ensures that this value must be provided.
     */
    @ApiProperty()
    @IsNotEmpty()
    public password: string;
}

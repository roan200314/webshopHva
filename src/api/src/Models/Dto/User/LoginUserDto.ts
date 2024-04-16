import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Data transfer object (dto) for user login.
 * This class uses class-validator for validation of the inputs.
 */
export class LoginUserDto {
    /**
     * The email of the user for login.
     *
     * The @ApiProperty decorator is a part of @nestjs/swagger and is used
     * for api documentation.
     *
     * @IsNotEmpty decorator from the class-validator library ensures that
     * the username must be provided.
     */
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    /**
     * The password of the user for login.
     *
     * The @ApiProperty decorator is a part of @nestjs/swagger and is used
     * for api documentation.
     *
     * @IsNotEmpty decorator ensures that the password must be provided.
     */
    @ApiProperty()
    @IsNotEmpty()
    public password: string;
}

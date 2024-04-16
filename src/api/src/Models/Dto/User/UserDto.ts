import { IsInt, IsNotEmpty, MinLength } from "class-validator";
import { Expose } from "class-transformer";

/**
 * User data transfer object.
 */
export class UserDto {
    /**
     * The unique identifier for a user. Must be an integer and cannot be empty.
     */
    @IsInt()
    @IsNotEmpty()
    @Expose()
    public userId: number;

    /**
     * The username for a user. It must be at least five characters long and cannot be empty.
     */
    @MinLength(5)
    @IsNotEmpty()
    @Expose()
    public username: string;
}

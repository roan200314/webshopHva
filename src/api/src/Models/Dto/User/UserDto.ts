import { IsInt, IsNotEmpty, MinLength } from "class-validator";
import { Expose } from "class-transformer";

export class UserDto {
    @IsInt()
    @IsNotEmpty()
    @Expose()
    public id: number;

    @MinLength(5)
    @IsNotEmpty()
    @Expose()
    public email: string;

    @MinLength(5)
    @IsNotEmpty()
    @Expose()
    public name: string;
}

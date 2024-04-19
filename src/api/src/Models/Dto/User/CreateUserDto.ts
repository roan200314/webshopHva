import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @IsString()
    public name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public firstname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public lastname: string;

    @ApiProperty()
    @IsNotEmpty()
    public password: string;
}

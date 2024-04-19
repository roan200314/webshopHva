import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
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

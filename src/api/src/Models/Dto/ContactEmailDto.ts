import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ContactEmailDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public message: string;
}

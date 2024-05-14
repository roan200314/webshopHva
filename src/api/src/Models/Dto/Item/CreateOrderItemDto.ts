import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    public price: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public description: string;

    @ApiProperty()
    public imageURLs: string;
}

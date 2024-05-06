import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateAddressDto {
    @ApiProperty()
    @IsNumber()
    public id: number;

    @ApiProperty()
    @IsString()
    public street: string;

    @ApiProperty()
    @IsString()
    public city: string;

    @ApiProperty()
    @IsString()
    public zip: string;

    @ApiProperty()
    @IsString()
    public country: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    public content: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    public rating: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    public userId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    public gameId: number;
}

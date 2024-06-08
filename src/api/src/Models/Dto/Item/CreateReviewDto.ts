import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber} from "class-validator";

export class CreateReviewDto {
    @ApiProperty()
    @IsNotEmpty()
    public content: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    public rating: number;

}
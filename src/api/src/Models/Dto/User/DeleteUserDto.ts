import { Expose } from "class-transformer";
import { IsInt } from "class-validator";

export class DeleteUserDto {
    @IsInt()
    @Expose()
    public id: number;
}
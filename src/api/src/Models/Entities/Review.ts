import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Games } from "./Games";
import { User } from "./User";

@Entity("Review")
export class Review {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "text", nullable: false })
    @ApiProperty()
    public content: string;

    @Column({ type: "int", nullable: false })
    @ApiProperty()
    public rating: number;

    @ManyToOne(() => Games, game => game.reviews)
    public game: Games;

    @ManyToOne(() => User, user => user.reviews)
    public user: User;
}

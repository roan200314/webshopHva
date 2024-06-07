import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Games } from "./Games";

/**
 * @class User
 * @classdesc Entity representing a User in the system
 */
@Entity("Review")
export class Review {
    @PrimaryGeneratedColumn()
    public id: number;

    @OneToOne(() => User, (user) => user.id)
    public userId: Review;

    @OneToOne(() => Games, (game) => game.id)
    public gameId: Review;

    @Column({ type: "varchar", length: 255, nullable: false })
    public text: string;
}
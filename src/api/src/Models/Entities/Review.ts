import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

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

    @ManyToOne(() => OrderItem, (orderItem) => orderItem.reviews)
    public orderItem: OrderItem;

    @ManyToOne(() => User, (user) => user.reviews)
    public user: User;
}

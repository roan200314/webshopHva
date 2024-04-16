import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("CartItem")
export class CartItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "integer", default: 0 })
    public amount: number;

    @ManyToOne(() => User, user => user.cart)
    public user: User;
}
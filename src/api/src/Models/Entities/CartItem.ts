import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity("CartItem")
export class CartItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "integer", default: 0 })
    public amount: number;

    @Column({ type: "boolean", default: false })
    public featured: boolean;

    @ManyToOne(() => OrderItem)
    public item: OrderItem;

    @ManyToOne(() => User, (user) => user.cart)
    public user: User;
}

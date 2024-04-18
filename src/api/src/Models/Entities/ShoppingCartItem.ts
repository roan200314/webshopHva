import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { OrderItem } from "./OrderItem";

@Entity()
export class ShoppingCartItem {
    @PrimaryColumn()
    public id: number;

    @OneToOne(() => OrderItem)
    @JoinColumn()
    public orderItem: OrderItem;

    @Column()
    public amount: number;
}
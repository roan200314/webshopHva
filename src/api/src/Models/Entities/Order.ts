import { OrderItem } from "./OrderItem";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToMany(() => OrderItem)
    @JoinTable()
    public products: OrderItem[];

    @Column()
    public status: string;
}
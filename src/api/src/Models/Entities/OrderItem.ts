import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

@Entity("OrderItem")
export class OrderItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    public name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    public description?: string;

    @Column({ type: "decimal", precision: 15, scale: 2, nullable: false })
    public price: number;

    @Column({ type: "json", nullable: true })
    public imageURLs?: string[];

    @ManyToOne(() => Order, order => order.products)
    public order: Order;
}
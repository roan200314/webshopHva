import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity("Order")
export class Order {
    @PrimaryGeneratedColumn()
    public id: number;

    @OneToMany((_) => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    public products: OrderItem[];

    @Column({ type: "varchar", length: 255, nullable: false})
    public name: string;

    @Column({ type: "varchar", length: 255, nullable: false})
    public email: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public status: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public street: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public city: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public zip: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public country: string;

    @ManyToOne(() => User, (user) => user.orders)
    public user: User;
}

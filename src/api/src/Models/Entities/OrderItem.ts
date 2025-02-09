import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Order } from "./Order";
import { OrderItemType } from "../Enumerations/OrderItemType";
import { Games } from "./Games";
import { Review } from "./Review";

@Entity("OrderItem")
export class OrderItem {
    public constructor(init?: Partial<OrderItem>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    public name: string;

    @Column({ type: "text", nullable: true })
    public description?: string;

    @Column({ type: "decimal", precision: 15, scale: 2, nullable: false })
    public price: number;

    @Column({ type: "json", nullable: true })
    public imageURLs?: string[];

    @Column({ type: "boolean", default: false })
    public featured: boolean;

    @ManyToOne(() => Order, (order) => order.products)
    public order: Order;

    @OneToMany(() => Review, (review) => review.orderItem)
    public reviews: Review[];

    @Column({ type: "enum", enum: OrderItemType, nullable: true })
    public itemType?: OrderItemType;

    @ManyToOne(() => Games, { nullable: true, eager: true })
    @JoinColumn({ name: "itemId", referencedColumnName: "id" })
    public game: Games;

    @Column({ nullable: true })
    public itemId?: number;
}

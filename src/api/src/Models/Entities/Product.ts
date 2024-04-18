import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public maxPerCustomer: number;

    @Column()
    public inStock: number;

    @ManyToOne(() => Category)
    @JoinColumn()
    public category: Category;
}
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column("decimal")
    public price: number;

    @Column("simple-array")
    public imageURLs: string[];

    @ManyToOne(() => Category)
    @JoinColumn()
    public category: Category;
}
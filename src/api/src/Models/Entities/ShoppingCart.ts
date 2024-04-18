import { ShoppingCartItem } from "./ShoppingCartItem";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class ShoppingCart {
    @PrimaryColumn()
    public id: number;

    @OneToMany(() => ShoppingCartItem, (item) => item)
    public items: ShoppingCartItem[];
}
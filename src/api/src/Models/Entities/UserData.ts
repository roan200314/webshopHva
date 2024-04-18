import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./Address";
import { Order } from "./Order";
import { AuthorizationLevel } from "@shared/types";
import { ShoppingCart } from "./ShoppingCart";

@Entity()
export class UserData {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column()
    public name: string;

    @Column({ nullable: true })
    public firstName?: string;

    @Column({ nullable: true })
    public lastName?: string;

    @OneToMany(() => Address, (address) => address)
    public addresses?: Address[];

    @OneToMany(() => Order, (order) => order)
    public orders?: Order[];

    @Column({
        type: "enum",
        enum: AuthorizationLevel,
        default: AuthorizationLevel.USER
    })
    public authorizationLevel?: AuthorizationLevel;

    @OneToOne(() => ShoppingCart)
    @JoinColumn()
    public cart?: ShoppingCart;
}
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Address } from "./Address";
import { Order } from "./Order";
import { AuthorizationLevel } from "../Enumerations/AuthorizationLevel";
import { CartItem } from "./CartItem";
import { EmailConfirmation } from "./EmailConfirmation";

/**
 * @class User
 * @classdesc Entity representing a User in the system
 */
@Entity("User")
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    public email: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    @Exclude()
    public password: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    public firstName?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    public lastName?: string;

    @OneToOne(() => EmailConfirmation, (emailConfirmation) => emailConfirmation.user)
    public emailConfirmation: EmailConfirmation;

    @OneToMany((_) => Address, (address) => address.user)
    public addresses: Address[];

    @OneToMany((_) => Order, (order) => order.user)
    public orders: Order[];

    @Column({ type: "enum", enum: AuthorizationLevel, default: AuthorizationLevel.USER })
    public authorizationLevel: AuthorizationLevel;

    @OneToMany((_) => CartItem, (cartItem) => cartItem.user)
    public cart: CartItem[];
}

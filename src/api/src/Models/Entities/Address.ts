import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("Address")
export class Address {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    public street: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public city: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public zip: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public country: string;

    @ManyToOne(() => User, user => user.addresses)
    public user: User;
}
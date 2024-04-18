import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public street: string;

    @Column()
    public city: string;

    @Column()
    public zip: string;

    @Column()
    public country: string;
}
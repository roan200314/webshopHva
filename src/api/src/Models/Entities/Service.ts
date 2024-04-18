import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Period } from "../Enumerations/Period";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: "enum",
        enum: Period,
    })
    public period: Period;
}
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("EmailConfirmation")
export class EmailConfirmation {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    public confirmationToken: string;

    @Column({ type: "boolean", default: false })
    public confirmed: boolean;

    @OneToOne(() => User, (user) => user.emailConfirmation)
    @JoinColumn()
    public user: User;
}

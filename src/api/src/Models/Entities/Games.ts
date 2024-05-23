import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { GameTag } from "../Enumerations/GameTag";

@Entity("Games")
export class Games {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    @ApiProperty()
    public title: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    @ApiProperty()
    public thumbnail?: string;

    @Column({ type: "simple-array", nullable: true })
    @ApiProperty()
    public images?: string[];

    @Column({ type: "text", nullable: true })
    @ApiProperty()
    public descriptionMarkdown?: string;

    @Column({ type: "text", nullable: true })
    @ApiProperty()
    public descriptionHtml?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    @ApiProperty()
    public url: string;

    @Column({ type: "simple-array", nullable: false })
    @ApiProperty()
    public authors: string[];

    @Column({ type: "simple-array", nullable: false })
    @ApiProperty()
    public tags: GameTag[];
}

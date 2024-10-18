import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    teamId: number = 0

    @Column()
    teamName: string = ''

}
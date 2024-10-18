import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    playerId!: number

    @Column()
    firstName: string = ''

    @Column()
    lastName: string = ''

    @Column()
    teamId: number = 0

    @Column('numeric', { precision: 5, scale: 3})
    dupr: number = 0

    @Column()
    gender: string = ''

    // constructor(firstName: string, lastName: string, teamId: number, dupr: number, gender: string) {
    //     this.firstName = firstName;
    //     this.lastName = lastName;
    //     this.teamId = teamId;
    //     this.dupr = dupr;
    //     this.gender = gender;

}

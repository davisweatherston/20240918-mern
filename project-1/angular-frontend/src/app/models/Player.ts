export class Player {
    playerId: number;
    firstName: string;
    lastName: string;
    teamId: number;
    dupr: number;
    gender: string;

    constructor(playerId: number, 
                firstName: string,
                lastName: string,
                teamId: number,
                dupr: number,
                gender: string) {
        this.playerId = playerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.teamId = teamId;
        this.dupr = dupr;
        this.gender = gender;
    }
}
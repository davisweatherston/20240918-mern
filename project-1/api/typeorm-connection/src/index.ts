const express = require('express');
const bodyParser = require('body-parser');
import { AppDataSource } from "./data-source"
import { Player } from "./entity/Player"
import { Team } from "./entity/Team"

const app = express();
app.use(bodyParser.json());

export function addNewPlayer(firstName: string,
                        lastName: string,
                        teamId: number, 
                        dupr: number, 
                        gender: string) {

    AppDataSource.initialize().then(async () => {
        const newPlayer = new Player();
        newPlayer.firstName = firstName;
        newPlayer.lastName = lastName;
        newPlayer.teamId = teamId;
        newPlayer.dupr = dupr;
        newPlayer.gender = gender;

        await AppDataSource.manager.save(newPlayer)
    })
}

function addNewTeam(teamName: string) {
    AppDataSource.initialize().then(async () => {
        const newTeam = new Team()
    
        newTeam.teamName = teamName;

        await AppDataSource.manager.save(newTeam);
        console.log("Team has been saved: ", newTeam);
    })
}

export async function getAllPlayers() {
    try {
        // Initialize the AppDataSource (if it isn't already initialized)
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Get the repository for Player
        const playerRepository = AppDataSource.getRepository(Player);

        // Find all players
        const players = await playerRepository.find();

        // Return or log the players
        console.log(players);
        return players;

    } catch (error) {
        console.error("Error fetching players: ", error);
        throw error;  // Optionally rethrow the error for higher-level handling
    }
}

async function getAllTeams() {
    try {
        // Initialize the AppDataSource (if it isn't already initialized)
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    const teamRepository = AppDataSource.getRepository(Team);
    const teams = await teamRepository.find();

    console.log(teams);
    return teams

} catch (error) {
    console.error("Error fetching teams: ", error);
    throw error;  // Optionally rethrow the error for higher-level handling
}}

// Call the function
getAllPlayers();
getAllTeams();

const testPlayer = {firstName: 'Drew', lastName: 'Williams', teamId: 6, dupr: 5.7, gender: 'M'}

// addNewPlayer('Kristen', 'Kop', 6, 4.78, 'F');
// addNewTeam('Pickleball Ninjas');
// addNewPlayer(testPlayer);

module.exports = { addNewPlayer, addNewTeam }

import "reflect-metadata"
import { DataSource } from "typeorm"
import { Player } from "./entity/Player"
import { Team } from "./entity/Team"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgrespassword",
    database: "league_db",
    synchronize: false,
    logging: false,
    entities: [Player, Team],
    migrations: [],
    subscribers: [],
})

module.exports = {AppDataSource}
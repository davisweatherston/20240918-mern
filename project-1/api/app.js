// server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');


// Create an Express application
const app = express();
const port = 3000;

// Enable CORS for all routes
const cors = require('cors');
app.use(cors({ origin: process.env.CORS_WHITELIST.split(',') }));

app.use(express.json());

// Create a PostgreSQL client using a connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'league_db',
    password: 'postgrespassword',
    port: 5432,
});

// PLAYERS REQUESTS

// Basic route to fetch all players
app.get('/players', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM player'); // Adjust the table name as needed
        res.json(result.rows); // Send the rows back as JSON
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).send('Error fetching players');
    }
});

// Get player by ID
app.get('/players/:playerId', async (req, res) => {
    const { playerId } = req.params;
    // const { firstName, lastName, teamId, dupr, gender } = req.body;

    try {
        // Fetch the current player data from the database
        const currentPlayer = await pool.query('SELECT * FROM player WHERE "playerId" = $1', [playerId]);

        if (currentPlayer.rowCount === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }
        else {
            res.json(currentPlayer.rows)
        }
} catch {res.status(500).json({ message: 'Error creating player', error: error.message });}
})

// Get players by teamId
app.get('/players/team/:teamId', async (req, res) => {
    const { teamId } = req.params;
    // const { firstName, lastName, teamId, dupr, gender } = req.body;

    try {
        // Fetch the current player data from the database
        const currentPlayer = await pool.query('SELECT * FROM player WHERE "teamId" = $1', [teamId]);

        if (currentPlayer.rowCount === 0) {
            return res.status(404).json({ message: 'Players not found on that team' });
        }
        else {
            res.json(currentPlayer.rows)
        }
} catch {res.status(500).json({ message: 'Error getting team', error: error.message });}
})

app.get('/teams/:teamId/average-dupr', async (req, res) => {
    const { teamId } = req.params;

    try {
        // Query to calculate the average DUPR for a team
        const result = await pool.query(
            'SELECT AVG(dupr) as averageDupr FROM player WHERE "teamId" = $1',
            [teamId]
        );
        // console.log(result)
        if (result.rows.length === 0 || result.rows[0].averageDupr === null) {
            return res.status(404).json({ message: 'No players found for this team' });
        } else {
            const averageDupr = parseFloat(result.rows[0].averagedupr).toFixed(2); // round to 2 decimal places
            // console.log(averageDupr)
            res.json({ averageDupr });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error calculating average DUPR', error: error.message });
    }
});

// Create a new player route
app.post('/players', async (req, res) => {
    const { firstName, lastName, teamId, dupr, gender } = req.body;  // Get player data from the request body

    try {
        // Insert new player into the database using SQL
        const result = await pool.query(
            'INSERT INTO player ("firstName", "lastName", "teamId", dupr, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, teamId, dupr, gender]
        );

        // Respond with the newly created player (result.rows[0] will contain the inserted row)
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Handle error if query fails
        res.status(500).json({ message: 'Error creating player', error: error.message });
    }
});

// update player, handles only certain fields being updated as well
app.put('/players/:playerId', async (req, res) => {
    const { playerId } = req.params;
    const { firstName, lastName, teamId, dupr, gender } = req.body;

    try {
        // Fetch the current player data from the database
        const currentPlayer = await pool.query('SELECT * FROM player WHERE "playerId" = $1', [playerId]);

        if (currentPlayer.rowCount === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Use existing values if the new ones are not provided
        const updatedFirstName = firstName || currentPlayer.rows[0].firstName;
        const updatedLastName = lastName || currentPlayer.rows[0].lastName;
        const updatedTeamId = teamId || currentPlayer.rows[0].teamId;
        const updatedDupr = dupr || currentPlayer.rows[0].dupr;
        const updatedGender = gender || currentPlayer.rows[0].gender;

        // Update the player in the database with only the provided fields
        const result = await pool.query(
            'UPDATE player SET "firstName" = $1, "lastName" = $2, "teamId" = $3, "dupr" = $4, "gender" = $5 WHERE "playerId" = $6 RETURNING *',
            [updatedFirstName, updatedLastName, updatedTeamId, updatedDupr, updatedGender, playerId]
        );

        res.status(200).json({ message: 'Player updated successfully', updatedPlayer: result.rows[0] });

    } catch (error) {
        res.status(500).json({ message: 'Error updating player', error: error.message });
    }
});

app.delete('/players/:playerId', async (req, res) => {
    const { playerId } = req.params;

    try {
        // Execute SQL query to delete the player from the database
        const result = await pool.query('DELETE FROM player WHERE "playerId" = $1 RETURNING *', [playerId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Respond with a success message and the deleted player info
        res.status(200).json({ message: 'Player deleted successfully', deletedPlayer: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting player', error: error.message });
    }
});

// TEAMS REQUESTS

app.get('/teams', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM team'); // Adjust the table name as needed
        res.json(result.rows); // Send the rows back as JSON
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).send('Error fetching teams');
    }
});

app.post('/teams', async (req, res) => {
    const { teamName } = req.body;  

    try {
        // Insert new team into the database using SQL
        const result = await pool.query(
            'INSERT INTO team ("teamName") VALUES ($1) RETURNING *',
            [teamName]
        );

        // Respond with the newly created team (result.rows[0] will contain the inserted row)
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Handle error if query fails
        res.status(500).json({ message: 'Error creating team', error: error.message });
    }
})

app.delete('/teams/:teamId', async (req, res) => {
    const { teamId } = req.params;
    try {
        // Execute SQL query to delete the team from the database
        const result = await pool.query('DELETE FROM team WHERE "teamId" = $1 RETURNING *', [teamId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Respond with a success message and the deleted team info
        res.status(200).json({ message: 'Team deleted successfully', deletedTeam: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team', error: error.message });
    }
});

app.put('/teams/:teamId', async (req, res) => {
    const { teamId } = req.params;  
    const { teamName } = req.body;

    try {
        // Update team into the database using SQL
        const result = await pool.query(
            'UPDATE team SET "teamName" = $1 WHERE "teamId" = $2 RETURNING *',
            [teamName, teamId]
        );

        // Respond with the newly update team (result.rows[0] will contain the inserted row)
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Handle error if query fails
        res.status(500).json({ message: 'Error updating team', error: error.message });
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const GameRoom = require('../schema/gameRoom1');

// Create or join a game room
router.post('/createOrJoin', async (req, res) => {
    const { roomId, player1Id, player2Id } = req.body;
    try {
        let gameRoom = await GameRoom.findOne({ roomId });

        if (!gameRoom) {
            // Check both possible roomId formats
            gameRoom = await GameRoom.findOne({ roomId: `${player1Id}-${player2Id}` });
            if (!gameRoom) {
                gameRoom = await GameRoom.findOne({ roomId: `${player2Id}-${player1Id}` });
            }

            if (!gameRoom) {
                gameRoom = new GameRoom({ roomId: `${player1Id}-${player2Id}`, players: [player1Id, player2Id] });
                await gameRoom.save();
            } else {
                // Ensure both players are added to the existing room
                if (!gameRoom.players.includes(player1Id)) {
                    gameRoom.players.push(player1Id);
                }
                if (!gameRoom.players.includes(player2Id)) {
                    gameRoom.players.push(player2Id);
                }
                await gameRoom.save();
            }
        }

        res.status(200).json(gameRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Join an existing game room
router.post('/join', async (req, res) => {
    const { roomId, playerId } = req.body;
    try {
        const gameRoom = await GameRoom.findOne({ roomId });
        if (!gameRoom) {
            return res.status(404).json({ error: 'Game room not found' });
        }
        if (gameRoom.players.length >= 2) {
            return res.status(400).json({ error: 'Room is full' });
        }
        if (gameRoom.players.includes(playerId)) {
            return res.status(400).json({ error: 'Player already in the room' });
        }
        gameRoom.players.push(playerId);
        await gameRoom.save();
        res.status(200).json(gameRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update game state (make move)
router.post('/move', async (req, res) => {
    const { roomId, index, symbol } = req.body;
    try {
        // Find the game room by roomId
        const gameRoom = await GameRoom.findOne({ roomId });
        if (!gameRoom) {
            return res.status(404).json({ error: 'Game room not found' });
        }

        // Convert symbol ('X' or 'O') to corresponding number (1 or -1)
        let playerSymbol;
        if (symbol === 'X') {
            playerSymbol = 1;
        } else if (symbol === 'O') {
            playerSymbol = -1;
        } else {
            return res.status(400).json({ error: 'Invalid symbol' });
        }

        // Update the board at the specified index
        gameRoom.board[index] = playerSymbol;

        // Update currentPlayer (toggle between 1 and -1)
        gameRoom.currentPlayer = -gameRoom.currentPlayer;

        // Save the updated game room
        await gameRoom.save();

        // Respond with updated game room
        res.status(200).json(gameRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

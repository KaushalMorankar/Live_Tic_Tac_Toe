const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { User } = require('./schema/login');
const validator = require('validator');
const gameRoomRoutes = require('./routes/gameRoom'); // Import game room routes
const axios = require('axios');
const GameRoom = require('./schema/gameRoom1');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

mongoose.connect(process.env.MONGODB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use(cors());
app.use(express.json());
app.use('/game', gameRoomRoutes); // Use game room routes

let onlineUsers = [];

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('addNewUser', (userID) => {
        if (!onlineUsers.some((user) => user.userID === userID)) {
            onlineUsers.push({
                userID,
                socketID: socket.id,
            });
        }
        io.emit('getOnlineUsers', onlineUsers);
    });

    socket.on('createRoom', ({ roomId, userId }) => {
        socket.join(roomId);
        socket.to(roomId).emit('userJoined', userId);
    });

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
    });

    socket.on('makeMove', async ({ roomId, move }) => {
        try {
            // Update the board in the database with the new move
            const gameRoom = await GameRoom.findOne({ roomId });

            if (!gameRoom) {
                throw new Error('Game room not found');
            }

            // Make the move on the board
            gameRoom.board[move.row][move.col] = move.symbol;
            gameRoom.currentPlayer = move.symbol === 1 ? -1 : 1; // Switch player

            await gameRoom.save();

            io.to(roomId).emit('moveMade', { board: gameRoom.board, currentPlayer: gameRoom.currentPlayer });
        } catch (error) {
            console.error('Error making move:', error);
        }
    });

    socket.on('resetGame', async ({ roomId }) => {
        try {
            await GameRoom.findOneAndUpdate(
                { roomId },
                {
                    board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
                    currentPlayer: 1,
                    winner: null,
                }
            );
            io.to(roomId).emit('resetGame');
        } catch (error) {
            console.error('Error resetting game:', error);
        }
    });

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.socketID !== socket.id);
        io.emit('getOnlineUsers', onlineUsers);
        console.log('User disconnected', socket.id);
    });
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: true, message: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: true, message: 'Enter a valid email' });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: true, message: 'Enter a strong password' });
        }

        let user1 = await User.findOne({ email });
        if (user1) {
            return res.status(400).json({ error: true, message: 'User already exists' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: true, message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: 'Invalid User' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: true, message: 'Wrong password' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: error.message });
    }
});

app.get('/api/onlineUsers', async (req, res) => {
    res.status(200).json(onlineUsers);
});

server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});

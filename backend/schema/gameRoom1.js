const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    board: { type: [[Number]], default: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] },
    currentPlayer: { type: Number, default: 1 }, // 1 for 'X', -1 for 'O'
    winner: { type: Number, default: null }
});

const GameRoom = mongoose.model('GameRoom', gameRoomSchema);

module.exports = GameRoom;

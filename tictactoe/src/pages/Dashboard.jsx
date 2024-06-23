import React, { useState, useEffect } from 'react';
import Board from './Board';
import Potentialchat from './users';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import axios from 'axios';

export default function Dashboard({ socket }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [gameRoom, setGameRoom] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (socket && currentUser) {
            socket.emit("addNewUser", currentUser._id);

            socket.on("getOnlineUsers", (onlineUsers) => {
                setOnlineUsers(onlineUsers.filter(u => u.userID !== currentUser._id));
            });

            socket.on("userJoined", (userId) => {
                console.log(`User ${userId} joined the room`);
                setGameRoom(prev => ({ ...prev, opponentId: userId }));
            });

            socket.on("moveMade", ({ board, currentPlayer }) => {
                setGameRoom(prev => ({ ...prev, board, currentPlayer }));
            });

            return () => {
                socket.off("getOnlineUsers");
                socket.off("userJoined");
                socket.off("moveMade");
            };
        }
    }, [socket, currentUser]);

    const createChat = async (userId1, userId2) => {
        const roomId = `${userId1}-${userId2}`;
        try {
            const response = await axios.post('http://localhost:5000/game/createOrJoin', {
                roomId,
                player1Id: userId1,
                player2Id: userId2,
            });
            setGameRoom(response.data);
            socket.emit("createRoom", { roomId, userId: userId1 });
            console.log('Game room created or joined:', response.data);
        } catch (error) {
            console.error('Error creating or joining game room:', error);
        }
    };

    useEffect(() => {
        if (gameRoom && socket && currentUser) {
            socket.emit("joinRoom", { roomId: gameRoom.roomId, userId: currentUser._id });
        }
    }, [gameRoom, socket, currentUser]);

    return (
        <div className="dashboard">
            <div className="users-list">
                Users: <Potentialchat 
                    potential={onlineUsers} 
                    currentUser={currentUser} 
                    createChat={createChat} 
                />
            </div>
            <div className="game-board">
                {gameRoom && <Board gameRoom={gameRoom} socket={socket} currentUser={currentUser} />}
            </div>
        </div>
    );
}

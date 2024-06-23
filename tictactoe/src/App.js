import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/Navbar';
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Logout from "./pages/Logout";
import { Container } from "react-bootstrap";
import { Route, Routes, Navigate } from "react-router-dom";
import io from 'socket.io-client';

export default function App() {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user from local storage:", error);
            }
        }
    }, []);

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && user) {
            socket.emit("addNewUser", user._id);
            socket.on("getOnlineUsers", (res) => {
                setOnlineUsers(res);
            });
            return () => {
                socket.off("getOnlineUsers");
            };
        }
    }, [socket, user]);

    return (
        <div className="app-container">
            <NavBar />
            <div className='background'></div>
            <Container className="form-container">
                <Routes>
                    <Route path="/" element={user ? <Dashboard onlineUsers={onlineUsers} socket={socket} /> : <Login setUser={setUser} />} />
                    <Route path="/signup" element={user ? <Dashboard onlineUsers={onlineUsers} socket={socket} /> : <Signup setUser={setUser} />} />
                    <Route path="/login" element={user ? <Dashboard onlineUsers={onlineUsers} socket={socket} /> : <Login setUser={setUser} />} />
                    <Route path="/logout" element={<Logout setUser={setUser} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Container>
        </div>
    );
}

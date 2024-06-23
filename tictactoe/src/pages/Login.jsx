import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import "./login.css";

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginuser = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful', data);

            // Store the user in local storage
            localStorage.setItem('user', JSON.stringify(data));

            // Update user state in App.js
            setUser(data);

            navigate('/dashboard');
        } else {
            console.error('Login failed');
        }
    };

    return (
        <Container className="mt-5" style={{ height: '90vh' }}>
            <Form className="w-50 mx-auto" onSubmit={loginuser}>
                <Form.Group className="mb-5">
                    <Form.Label className='label'>Enter Your Email ID</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label className='label'>Enter Your Password</Form.Label>
                    <Form.Control
                        type='password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type='submit' className="mr-2">Login</Button>
                <Button variant='secondary' className='ml-2' onClick={() => navigate('/signup')}>Sign Up</Button>
            </Form>
        </Container>
    );
}

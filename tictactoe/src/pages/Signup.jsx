import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./login.css";

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signupuser = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Handle successful signup (e.g., store token, navigate to login page)
            console.log('Signup successful', data);
            navigate('/dashboard');
        } else {
            // Handle signup error
            console.error('Signup failed');
        }
    };

    return (
        <div className="container mt-5">
            <Form className="w-50 mx-auto" onSubmit={signupuser}>
                <Form.Group>
                    <Form.Label className='label'>Name:</Form.Label>
                    <Form.Control
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label className='label'>Email:</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label className='label'>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" className="mr-2 ml-2">Signup</Button>
            </Form>
        </div>
    );
};

export default Signup;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout({ setUser }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data from local storage and update state
        localStorage.removeItem('user');
        setUser(null);
        // Redirect to the login page
        navigate('/login');
    }, [setUser, navigate]);

    return null; // This component doesn't need to render anything
}

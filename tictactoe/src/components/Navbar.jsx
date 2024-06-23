import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';

const NavBar = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/logout');
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8CpaOPxeppHopt0OlZCAh9DibCE4pWEiRqw&s'}
                        alt='Logo'
                        style={{ height: '50px', width: '50px' }} // Set your desired height and width
                    />
                </Navbar.Brand>
                LIVE TIC TAC TOE
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className='navbar-toggler-icon'></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/Signup">Signup</Nav.Link>
                        <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;

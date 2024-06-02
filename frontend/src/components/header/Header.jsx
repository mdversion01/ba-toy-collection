import React, { useState } from "react";

import BATCLogo from "../../svgs/BATCLogo";
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from "../login/Login";

const Header = ({ toys }) => {

  const [user, setUser] = useState(null);

  // Get the user's role from localStorage
  const userRole = localStorage.getItem('userRole');

  // Function to handle user logout
  const handleLogout = () => {
    // Clear the user-related information from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');

    // Update the component's state to reflect the user's logout
    setUser(null);

  };

  // Gets the total number of toys
  // const totalToys = toys.reduce((a, v) => a = a + v.quantity, 0);

  return (
    <header className="headerStyle">
      <div className="container-fluid px-0">
        <div className="logo">
          <BATCLogo />
        </div>
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
          <Container fluid>
            <Nav className="me-auto">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/toy-list" className="nav-link">All Toys</Link>
              <Link to="/toys-by-company" className="nav-link">Toys by Company</Link>
            </Nav>
            <div className="login">
              {userRole ? (
                <div className="logout-wrapper">
                  <div className="user-name me-3">{userRole}</div>
                  <button className="btn btn-sm btn-light logout" onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <Login />
              )}
            </div>
          </Container>
        </Navbar>


      </div>
    </header>
  );
};

export default Header;


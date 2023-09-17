import React, { useState } from "react";

import BATCLogo from "../../svgs/BATCLogo";
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ModalAddContent from "../modal/ModalAddContent";
import Login from "../login/Login";

const Header = ({ toys }) => {

  const [user, setUser] = useState(null);

  // Get the user's role from localStorage
  const userRole = localStorage.getItem('userRole');

  // Check if the userRole exists and is not null
  if (userRole) {
    // Do something with the user's role (e.g., store it in state)
    console.log('User role:', userRole);
  } else {
    // Handle the case when the user's role is not found in localStorage
    console.log('User role not found in localStorage');
  }

  // Function to handle user logout
  const handleLogout = () => {
    // Clear the user-related information from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');

    // Update the component's state to reflect the user's logout
    setUser(null);

    // You can perform additional actions here, such as redirecting the user
    // For example, you can use the React Router to navigate to a different route
    // history.push('/login'); // Assuming you have set up React Router

    console.log('User logged out');
  };

  // Gets the total number of toys
  const totalToys = toys.reduce((a, v) => a = a + v.quantity, 0);

  return (
    <header className="headerStyle">
      <div className="container-fluid px-0">
        <div className="logo">
          <BATCLogo />
        </div>
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
          <Container>
            <Nav className="me-auto">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/toy-list" className="nav-link">All Toys</Link>
              <Link to="/toys-by-company" className="nav-link">Toys by Company</Link>
              <Link to="/registration" className="nav-link">Registration</Link>
              {userRole === 'admin' && (
                <ModalAddContent
                  buttonText="Add New Toy"
                  title="Add New Toy"
                />
              )}
            </Nav>
            <div className="total-count">Toy Total: {totalToys}</div>
            <div className="login">
              {userRole ? (
                <div>
                  <span className="user-name">{userRole}</span>
                  <button className="logout" onClick={handleLogout}>Logout</button>
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


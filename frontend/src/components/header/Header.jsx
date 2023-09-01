import React from "react";

import BATCLogo from "../../svgs/BATCLogo";
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ModalAddContent from "../modal/ModalAddContent";



const Header = ({ toys }) => {

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
            <ModalAddContent
              buttonText="Add New Toy"
              title="Add New Toy"
            />
            </Nav>
            <div className="total-count">Toy Total: {totalToys}</div>
          </Container>
        </Navbar>
        

      </div>
    </header>
  );
};

export default Header;


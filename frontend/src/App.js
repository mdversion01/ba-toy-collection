import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/header/Header';
import Home from './pages/Home';
import ToyList from './pages/ToyList';
import ToysByCompany from './pages/ToysByCompany';
import Registration from './pages/Registration';
import { endpoints } from "./endpoints/Endpoints";

const App = () => {
  const [toys, setToys] = useState([]);

  useEffect(() => {
    axios.get(endpoints.API_URL + 'toys/')
      .then((response) => {
        setToys(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Router>
      <div className="layout">
        <Header toys={toys} />
        <div className="main-wrapper">
          <MainContent />
        </div>
      </div>
    </Router>
  );
};

const MainContent = () => {
  const location = useLocation();

  const mainClassName = location.pathname === "/" ? "main scroll" : "main";

  return (
    <div className={mainClassName}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/toy-list" element={<ToyList />} />
        <Route path="/toys-by-company" element={<ToysByCompany />} />
        <Route path="/registration" element={<Registration />} />
        {/* Add more routes using Route */}
      </Routes>
    </div>
  );
};

export default App;

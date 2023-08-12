import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes from 'react-router-dom' instead of Switch

import Header from './components/header/Header';
import Home from './pages/Home';
import ToyList from './pages/ToyList';
import ToysByCompany from './pages/ToysByCompany';
import { endpoints } from "./endpoints/Endpoints";

const App = () => {

  const [toys, setToys] = useState([]);

  useEffect(() => {
    // Fetch data from the API endpoint using Axios
    axios.get(endpoints.API_URL + 'toys/') // Replace '/api/toys' with the actual endpoint URL
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
        <div className="main">
        <Routes> {/* Use Routes instead of Switch */}
          <Route exact path="/" element={<Home />} />

          <Route path="/toy-list" element={<ToyList />} /> {/* Use element prop instead of component */}
          <Route path="/toys-by-company" element={<ToysByCompany />} />
          {/* Add more routes using Route */}
        </Routes>
        </div>
        </div>
      </div>
    </Router>
  );
};

export default App;

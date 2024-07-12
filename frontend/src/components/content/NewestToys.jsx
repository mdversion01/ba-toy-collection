// src/components/NewestToys.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { endpoints } from "../../endpoints/Endpoints";
import Thumb from "./Thumb";

const NewestToys = () => {
  const [newToys, setNewToys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewToys = async () => {
      try {
        const response = await axios.get(endpoints.API_URL + "toys");
        const toys = response.data;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredToys = toys.filter((toy) => {
          const toyDate = new Date(toy.dateadded);
          return toyDate >= thirtyDaysAgo;
        });

        setNewToys(filteredToys);
      } catch (error) {
        console.error("Error fetching toys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewToys();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (newToys.length === 0) {
    return <div>No new toys have been added lately.</div>;
  }

  return (
    <>
    <h2>Newly Added Toys</h2>
    <div className="new-toys">
      {newToys.map((toy) => (
        <Thumb key={toy.id} toy={toy} />
      ))}
    </div>
    </>
  );
};

export default NewestToys;

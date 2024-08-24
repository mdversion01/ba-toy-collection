// src/components/NewestToys.jsx
import React, { useEffect, useState } from "react";
import toysData from "../../json/toys.json";
import Thumb from "./Thumb";

const NewestToys = () => {
  const [newToys, setNewToys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewToys = () => {
      try {
        const toys = toysData;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredToys = toys.filter((toy) => {
          const toyDate = new Date(toy.dateadded);
          return toyDate >= thirtyDaysAgo;
        });

        const sortedToys = filteredToys.sort((a, b) => a.name.localeCompare(b.name));

        setNewToys(sortedToys);
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

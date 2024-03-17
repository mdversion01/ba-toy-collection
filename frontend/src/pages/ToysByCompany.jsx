import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { endpoints } from "../endpoints/Endpoints";
import socketIOClient from "socket.io-client";
import _ from "lodash";
import ToysByCompanyContent from "../components/content/ToysByCompanyContent";
import Filters from "../components/filters/Filters";
import CustomPagination from "../components/pagination/CustomPagination";

const ToysByCompany = () => {
  const [toys, setToys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toysPerPage] = useState(100);
  const [allTotalPrice, setAllTotalPrice] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    companies: [],
    brands: [],
    series: [],
    collections: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    company: "",
    brand: "",
    series: "",
    collection: "",
  });
  const [filteredToys, setFilteredToys] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const userRole = localStorage.getItem("userRole");

  const fetchWithRetry = async (url, attempts) => {
    for (let i = 0; i < attempts; i++) {
      try {
        return await axios.get(url);
      } catch (error) {
        if (i === attempts - 1) throw error;
      }
    }
  };

  const fetchAndProcessToys = async () => {
    try {
      // const { data } = await axios.get(`${endpoints.API_URL}toys`);
      const { data } = await fetchWithRetry(`${endpoints.API_URL}toys`, 3);
      const sortedToys = processToysData(data);

      const allTotalPrice = sortedToys.reduce(
        (acc, toy) => acc + toy.price * toy.quantity,
        0
      );
      setAllTotalPrice(allTotalPrice);

      setToys(sortedToys);
      updateFilterOptions(sortedToys);
      filterAndSetToys(sortedToys);
    } catch (error) {
      console.error("Failed to fetch toys after multiple attempts:", error);
      console.error("Error fetching toys:", error);
    }
  };

  useEffect(() => {
    fetchAndProcessToys();
    const socket = socketIOClient("http://localhost:3002");
    socket.on("itemAdded", fetchAndProcessToys);
    socket.on("updateItem", fetchAndProcessToys);

    return () => socket.disconnect();
  }, [selectedFilters, updateTrigger]);

  const processToysData = (toysData) => {
    return toysData.sort((a, b) => {
      return (
        a.company.localeCompare(b.company) ||
        a.brand.localeCompare(b.brand) ||
        a.series.localeCompare(b.series) ||
        a.collection.localeCompare(b.collection) ||
        a.name.localeCompare(b.name)
      );
    });
  };

  const updateFilterOptions = (sortedToys) => {
    const companies = [...new Set(sortedToys.map((toy) => toy.company))].sort();
    const brands = [...new Set(sortedToys.map((toy) => toy.brand))].sort();
    const series = [...new Set(sortedToys.map((toy) => toy.series))].sort();
    const collections = [
      ...new Set(sortedToys.map((toy) => toy.collection)),
    ].sort();

    setFilterOptions({ companies, brands, series, collections });
  };

  const filterAndSetToys = (sortedToys) => {
    const filtered = toys.filter(toy => {
      const matchesName = selectedFilters.name ? toy.name.toLowerCase().includes(selectedFilters.name.toLowerCase()) : true;
      const matchesCompany = selectedFilters.company ? toy.company === selectedFilters.company : true;
      const matchesBrand = selectedFilters.brand ? toy.brand === selectedFilters.brand : true;
      const matchesSeries = selectedFilters.series ? toy.series === selectedFilters.series : true;
      const matchesCollection = selectedFilters.collection ? toy.collection === selectedFilters.collection : true;
  
      return matchesName && matchesCompany && matchesBrand && matchesSeries && matchesCollection;
    });

    setFilteredToys(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({ company: "", brand: "", series: "", collection: "" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  const totalToys = toys.reduce((a, v) => a + v.quantity, 0);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages based on the length of filtered toys
  const totalPages = Math.ceil(filteredToys.length / toysPerPage);

  // Determine the toys to be displayed on the current page
  const indexOfFirstToy = (currentPage - 1) * toysPerPage;
  const currentToys = filteredToys.slice(
    indexOfFirstToy,
    indexOfFirstToy + toysPerPage
  );

  // Calculate the total value of the current page's toys
  let currentPageValue = currentToys.reduce(
    (acc, toy) => acc + toy.price * toy.quantity,
    0
  );

  useEffect(() => {
    filterAndSetToys();
  }, [selectedFilters, toys]); // Add `toys` to ensure the toys list is updated accordingly.

  const handleNameSearch = useCallback(_.debounce((searchTerm) => {
    setSelectedFilters(prevFilters => ({ ...prevFilters, name: searchTerm }));
  }, 300), []); // Dependencies adjusted
  
  

  return (
    <>
      <div className="page-title">
        Toys by Company

        <div className="totals">
          <div className="total-count">Toy Total: {totalToys}</div>
          {userRole === "admin" && (
            <>
              <div className="current-page">
                Collection Total Value: ${allTotalPrice.toFixed(2)}
              </div>
              <div className="current-page">
                Current Page Value: ${currentPageValue.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>

      <Filters
        filterOptions={filterOptions}
        handleNameSearch={handleNameSearch}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filteredToys={filteredToys}
        toys={toys}
      />

      <ToysByCompanyContent
        key={updateTrigger}
        currentPage={currentPage}
        toysPerPage={toysPerPage}
        currentToys={currentToys} // Pass the current toys to the child component
        toys={toys} // Pass all toys to the child component
      />

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ToysByCompany;

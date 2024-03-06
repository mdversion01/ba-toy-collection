import React, { useEffect, useState } from "react";
import axios from "axios";
import { endpoints } from "../endpoints/Endpoints";
import socketIOClient from "socket.io-client";
import ToyListContent from "../components/content/ToyListContent";
import Filters from "../components/filters/Filters";
import { Pagination } from "react-bootstrap";

const ToysList = () => {
  const [toys, setToys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toysPerPage] = useState(50); // Number of toys to show per page
  // Add state for total price and quantity
  const [allTotalQuantity, setAllTotalQuantity] = useState(0);
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

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchToys = async () => {
      try {
        const response = await axios.get(endpoints.API_URL + "toys");
        const sortedToys = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setToys(sortedToys);

        // Extract filter options
        const companies = [...new Set(sortedToys.map((toy) => toy.company))];
        const brands = [...new Set(sortedToys.map((toy) => toy.brand))];
        const series = [...new Set(sortedToys.map((toy) => toy.series))];
        const collections = [
          ...new Set(sortedToys.map((toy) => toy.collection)),
        ];

        // Sort filter options alphabetically
        companies.sort();
        brands.sort();
        series.sort();
        collections.sort();

        // Update filter options in state
        setFilterOptions({
          companies,
          brands,
          series,
          collections,
        });

        // Calculate total price and quantity for all toys
        let totalQuantity = 0;
        let totalPrice = 0;
        sortedToys.forEach((toy) => {
          totalQuantity += toy.quantity;
          totalPrice += toy.price * toy.quantity;
        });

        setAllTotalQuantity(totalQuantity);
        setAllTotalPrice(totalPrice);

        applyFilters(sortedToys);
      } catch (error) {
        console.error("Error fetching toys:", error);
      }
    };

    fetchToys();
    const socket = socketIOClient("http://localhost:3002");
    socket.on("itemAdded", fetchToys);
    socket.on("updateItem", fetchToys);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    applyFilters(toys);
  }, [selectedFilters, toys]);

  const applyFilters = (toysToFilter) => {
    const filtered = toysToFilter.filter(
      (toy) =>
        (!selectedFilters.company || toy.company === selectedFilters.company) &&
        (!selectedFilters.brand || toy.brand === selectedFilters.brand) &&
        (!selectedFilters.series || toy.series === selectedFilters.series) &&
        (!selectedFilters.collection ||
          toy.collection === selectedFilters.collection) &&
        (!selectedFilters.completed ||
          toy.completed === selectedFilters.completed)
    );

    setFilteredToys(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({ company: "", brand: "", series: "", collection: "" });
  };

  const pageRange = 8;
  const totalPages = Math.ceil(filteredToys.length / toysPerPage);
  const startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  const indexOfLastToy = currentPage * toysPerPage;
  const indexOfFirstToy = indexOfLastToy - toysPerPage;
  const currentToys = filteredToys.slice(indexOfFirstToy, indexOfLastToy);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  // Calculate the total price for the currently displayed toys
  let totalQuantity = 0;
  let totalPrice = 0;
  currentToys.forEach((toy) => {
    totalQuantity += toy.quantity;
    totalPrice += toy.price * toy.quantity;
  });

  // Gets the total number of toys
  const totalToys = toys.reduce((a, v) => (a = a + v.quantity), 0);

  return (
    <>
      <Filters
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        toys={toys}
      />

      <div className="page-title">
        All Toys
        <div className="totals">
          <div className="total-count">Toy Total: {totalToys}</div>
          {userRole === "admin" && (
            <>
              <div className="current-page">
                Collection Total Value: ${allTotalPrice.toFixed(2)}
              </div>
              <div className="current-page">
                Current Page Value: ${totalPrice.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>

      <ToyListContent currentToys={currentToys} dateadded={toys.dateadded} />

      <div className="pagination-wrapper">
        <Pagination size="sm">
          <Pagination.First
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <Pagination.Item
              key={startPage + index}
              active={startPage + index === currentPage}
              onClick={() => paginate(startPage + index)}
            >
              {startPage + index}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </>
  );
};

export default ToysList;

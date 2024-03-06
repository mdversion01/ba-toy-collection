import React, { useEffect, useState } from "react";
import axios from "axios";
import { endpoints } from "../endpoints/Endpoints";
import socketIOClient from "socket.io-client";
import ToysByCompanyContent from "../components/content/ToysByCompanyContent";
import Filters from "../components/filters/Filters";
import { Pagination } from "react-bootstrap";

const ToysByCompany = () => {
  const [toys, setToys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toysPerPage] = useState(100);
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
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const userRole = localStorage.getItem("userRole");

  const fetchAndProcessToys = async () => {
    try {
      const { data } = await axios.get(`${endpoints.API_URL}toys`);
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
        a.collection.localeCompare(b.collection)
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
    const filtered = sortedToys.filter(
      (toy) =>
        (!selectedFilters.company || toy.company === selectedFilters.company) &&
        (!selectedFilters.brand || toy.brand === selectedFilters.brand) &&
        (!selectedFilters.series || toy.series === selectedFilters.series) &&
        (!selectedFilters.collection ||
          toy.collection === selectedFilters.collection)
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

  let currentPageValue = currentToys.reduce(
    (acc, toy) => acc + toy.price * toy.quantity,
    0
  );

  const totalToys = toys.reduce((a, v) => a + v.quantity, 0);

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

      <ToysByCompanyContent
        key={updateTrigger}
        currentPage={currentPage}
        toysPerPage={toysPerPage}
        currentToys={currentToys} // Pass the current toys to the child component
        toys={toys} // Pass all toys to the child component
      />

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

export default ToysByCompany;

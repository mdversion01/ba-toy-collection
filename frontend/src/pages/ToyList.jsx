import React, { useEffect, useState } from "react";
import toysData from "../json/toys.json";
import ToyListContent from "../components/content/ToyListContent";
import Filters from "../components/filters/Filters";
import CustomPagination from "../components/pagination/CustomPagination";

const ToysList = () => {
  const [toys, setToys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toysPerPage] = useState(50); // Number of toys to show per page
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
    const fetchToys = () => {
      try {
        const data = toysData;
        const sortedToys = data.sort((a, b) => a.name.localeCompare(b.name));
        setToys(sortedToys);

        // Extract filter options
        const companies = [...new Set(sortedToys.map((toy) => toy.company))];
        const brands = [...new Set(sortedToys.map((toy) => toy.brand))];
        const series = [...new Set(sortedToys.map((toy) => toy.series))];
        const collections = [...new Set(sortedToys.map((toy) => toy.collection))];

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
          totalQuantity += Number(toy.quantity);
          totalPrice += Number(toy.price) * Number(toy.quantity);
        });

        setAllTotalQuantity(totalQuantity);
        setAllTotalPrice(totalPrice);

        applyFilters(sortedToys);
      } catch (error) {
        console.error("Error fetching toys:", error);
      }
    };

    fetchToys();
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
        (!selectedFilters.collection || toy.collection === selectedFilters.collection)
    );

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

  // Calculate the total price for the currently displayed toys
  const totalToys = filteredToys.reduce((a, v) => a + Number(v.quantity), 0);

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

  // Now that currentToys is defined, calculate the total value of the current page's toys
  let currentPageValue = currentToys.reduce(
    (acc, toy) => acc + Number(toy.price) * Number(toy.quantity),
    0
  );

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
                Current Page Value: ${currentPageValue.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>

      <ToyListContent currentToys={currentToys} dateadded={toys.dateadded} />

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ToysList;

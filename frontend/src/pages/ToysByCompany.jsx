import React, { useEffect, useState } from "react";
import toysData from "../json/toys.json";
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

  const fetchAndProcessToys = () => {
    try {
      const data = toysData;
      const sortedToys = processToysData(data);

      const totalQuantity = sortedToys.reduce(
        (acc, toy) => acc + Number(toy.quantity),
        0
      );

      const allTotalPrice = sortedToys.reduce(
        (acc, toy) => acc + Number(toy.price) * Number(toy.quantity),
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
    const filtered = sortedToys.filter(
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

  const totalToys = filteredToys.reduce((acc, toy) => acc + Number(toy.quantity), 0);

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
    (acc, toy) => acc + Number(toy.price) * Number(toy.quantity),
    0
  );

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
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
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

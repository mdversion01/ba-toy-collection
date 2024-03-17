import React from "react";
import { Form } from "react-bootstrap";

const Filters = ({
  filterOptions,
  selectedFilters,
  setSelectedFilters,
  handleNameSearch,
  filteredToys,
  toys,
}) => {
  const getUniqueFilteredOptions = (key) => {
    const uniqueOptions = new Set(
      filteredToys.map((toy) => toy[key]).filter(Boolean)
    );
    return [...uniqueOptions].sort();
  };

  // Dynamically update options based on filteredToys
  const companyOptions = getUniqueFilteredOptions("company");
  const brandOptions = selectedFilters.company
    ? getUniqueFilteredOptions("brand")
    : filterOptions.brands; // Assuming all brands are available if no company is selected
  const seriesOptions = selectedFilters.brand
    ? getUniqueFilteredOptions("series")
    : filterOptions.series; // Assuming all series are available if no brand is selected
  const collectionOptions = selectedFilters.series
    ? getUniqueFilteredOptions("collection")
    : filterOptions.collections; // Assuming all collections are available if no series is selected

  const handleFilterChange = (filterName, value) => {
    if (filterName === "name") {
      handleNameSearch(value); // Assuming handleNameSearch is a prop passed to Filters
    } else if (filterName === "company" && value === "") {
      // Reset all filters when "All Companies" is selected
      setSelectedFilters({
        company: "",
        brand: "",
        series: "",
        collection: "",
      });
    } else {
      // Update specific filter and reset dependent filters if necessary
      setSelectedFilters((prev) => ({
        ...prev,
        [filterName]: value,
        ...(filterName === "company" && {
          brand: "",
          series: "",
          collection: "",
        }),
      }));
    }
  };

  return (
    <div className="filter-section">
      <div className="row">
        <div className="col">
          <input
            type="text"
            aria-label="Search by name"
            className="form-control form-control-sm"
            placeholder="Search by name..."
            value={selectedFilters.name || ""}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
        </div>

        <div className="col">
          <Form.Select
            size="sm"
            aria-label="Companies"
            value={selectedFilters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
          >
            <option value="">All Companies</option>
            {companyOptions.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col">
          <Form.Select
            size="sm"
            aria-label="Brands"
            value={selectedFilters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
          >
            <option value="">All Brands</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col">
          <Form.Select
            size="sm"
            aria-label="Series"
            value={selectedFilters.series}
            onChange={(e) => handleFilterChange("series", e.target.value)}
          >
            <option value="">All Series</option>
            {seriesOptions.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col">
          <Form.Select
            size="sm"
            aria-label="Collections"
            value={selectedFilters.collection}
            onChange={(e) => handleFilterChange("collection", e.target.value)}
          >
            <option value="">All Collections</option>
            {collectionOptions.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              // Clear all selected filters
              setSelectedFilters({
                company: "",
                brand: "",
                series: "",
                collection: "",
                completed: "",
                name: "",
              });
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;

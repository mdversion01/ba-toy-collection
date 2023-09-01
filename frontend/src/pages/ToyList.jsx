import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from '../endpoints/Endpoints';

import ToyListContent from '../components/content/ToyListContent';
import { Form, Pagination } from 'react-bootstrap';

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
    collections: []
  });

  const [selectedFilters, setSelectedFilters] = useState({
    company: '',
    brand: '',
    series: '',
    collection: ''
  });

  const [filteredToys, setFilteredToys] = useState([]);

  useEffect(() => {
    axios.get(endpoints.API_URL + 'toys')
      .then((response) => {
        const sortedToys = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setToys(sortedToys);

        // Extract filter options
        const companies = [...new Set(sortedToys.map(toy => toy.company))];
        const brands = [...new Set(sortedToys.map(toy => toy.brand))];
        const series = [...new Set(sortedToys.map(toy => toy.series))];
        const collections = [...new Set(sortedToys.map(toy => toy.collection))];

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
          collections
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
      })
      .catch((error) => {
        console.error('Error fetching toys:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = toys.filter(toy => (
      (!selectedFilters.company || toy.company === selectedFilters.company) &&
      (!selectedFilters.brand || toy.brand === selectedFilters.brand) &&
      (!selectedFilters.series || toy.series === selectedFilters.series) &&
      (!selectedFilters.collection || toy.collection === selectedFilters.collection) &&
      (!selectedFilters.completed || toy.completed === selectedFilters.completed)
    ));

    setFilteredToys(filtered);
  }, [toys, selectedFilters]);

  // Calculate the range of pages to display
  const pageRange = 8;
  //const totalPages = Math.ceil(toys.length / toysPerPage);
  const totalPages = Math.ceil(filteredToys.length / toysPerPage);

  const startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
  const endPage = Math.min(startPage + pageRange - 1, totalPages);


  // Get current toys for the current page
  const indexOfLastToy = currentPage * toysPerPage;
  const indexOfFirstToy = indexOfLastToy - toysPerPage;
  const currentToys = filteredToys.slice(indexOfFirstToy, indexOfLastToy);

  // Change page
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

  return (
    <>
      <div className="filter-section">
        <div className="row">
          <div className="col">
            <Form.Select
              size="sm"
              aria-label="Companies"
              value={selectedFilters.company}
              onChange={(e) => {
                const selectedCompany = e.target.value;
                const selectedBrand = selectedFilters.brand;

                if (selectedCompany === '') {
                  // Reset all filters when "All Companies" is selected
                  setSelectedFilters({
                    company: '',
                    brand: '',
                    series: '',
                    collection: ''
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    company: selectedCompany,
                    brand: selectedCompany !== selectedFilters.company ? '' : selectedBrand,
                  });
                }
              }}
            >
              <option value="">All Companies</option>
              {filterOptions.companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col">
            <Form.Select
              size="sm"
              aria-label="Brands" value={selectedFilters.brand}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, brand: e.target.value })}
            >
              <option value="">All Brands</option>
              {filterOptions.brands
                .filter((brand) => !selectedFilters.company || toys.some((toy) => toy.company === selectedFilters.company && toy.brand === brand))
                .map((brand) => (
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
              onChange={(e) => {
                const selectedSeries = e.target.value;
                setSelectedFilters({ ...selectedFilters, series: selectedSeries });
              }}
            >
              <option value="">All Series</option>
              {filterOptions.series
                .filter((series) =>
                  !selectedFilters.company ||
                  !selectedFilters.brand ||
                  toys.some(
                    (toy) =>
                      toy.company === selectedFilters.company &&
                      toy.brand === selectedFilters.brand &&
                      toy.series === series
                  )
                )
                .map((series) => (
                  // Filter out blank/empty series
                  series && (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  )
                ))}
            </Form.Select>
          </div>
          <div className="col">
            <Form.Select
              size="sm"
              aria-label="Collections"
              value={selectedFilters.collection}
              onChange={(e) => {
                const selectedCollection = e.target.value;
                setSelectedFilters({ ...selectedFilters, collection: selectedCollection });
              }}
            >
              <option value="">All Collections</option>
              {filterOptions.collections
                .filter((collection) =>
                  !selectedFilters.company ||
                  !selectedFilters.brand ||
                  toys.some(
                    (toy) =>
                      toy.company === selectedFilters.company &&
                      toy.brand === selectedFilters.brand &&
                      toy.series === selectedFilters.series &&
                      toy.collection === collection
                  )
                )
                .map((collection) => (
                  // Filter out blank/empty collections
                  collection && (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  )
                ))}
            </Form.Select>
          </div>
          <div className="col">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                // Clear all selected filters
                setSelectedFilters({
                  company: '',
                  brand: '',
                  series: '',
                  collection: '',
                  completed: '',
                });
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="page-title">
        All Toys

        <div className="totals">
          <div>Collection Total Value: ${allTotalPrice.toFixed(2)}</div>
          <div className="current-page">Current Page Value: ${totalPrice.toFixed(2)}</div>
        </div>
      </div>

      <ToyListContent 
        currentToys={currentToys} 
        dateadded={toys.dateadded}
      />


      <div className="pagination-wrapper">
        <Pagination size="sm">
          <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <Pagination.Item
              key={startPage + index}
              active={startPage + index === currentPage}
              onClick={() => paginate(startPage + index)}
            >
              {startPage + index}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </>


  );
};

export default ToysList;

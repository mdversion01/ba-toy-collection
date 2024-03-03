import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from '../endpoints/Endpoints';
import socketIOClient from 'socket.io-client';

import ToysByCompanyContent from '../components/content/ToysByCompanyContent';
import { Form, Pagination } from 'react-bootstrap';

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
    company: '',
    brand: '',
    series: '',
    collection: '',
  });
  const [filteredToys, setFilteredToys] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const userRole = localStorage.getItem('userRole');

  // Function to fetch toys from the server
  const fetchToys = () => {
    axios.get(endpoints.API_URL + 'toys')
      .then((response) => {
        const sortedToys = response.data.sort((a, b) => {
          const companyComparison = a.company.localeCompare(b.company);
          if (companyComparison !== 0) return companyComparison;

          const brandComparison = a.brand.localeCompare(b.brand);
          if (brandComparison !== 0) return brandComparison;

          const seriesComparison = a.series.localeCompare(b.series);
          if (seriesComparison !== 0) return seriesComparison;

          return a.collection.localeCompare(b.collection);
        });

        setToys(sortedToys);

        const companies = [...new Set(sortedToys.map(toy => toy.company))];
        const brands = [...new Set(sortedToys.map(toy => toy.brand))];
        const series = [...new Set(sortedToys.map(toy => toy.series))];
        const collections = [...new Set(sortedToys.map(toy => toy.collection))];

        companies.sort();
        brands.sort();
        series.sort();
        collections.sort();

        setFilterOptions({
          companies,
          brands,
          series,
          collections,
        });

        let totalQuantity = 0;
        let totalPrice = 0;
        sortedToys.forEach((toy) => {
          totalQuantity += toy.quantity;
          totalPrice += toy.price * toy.quantity;
        });

        setAllTotalQuantity(totalQuantity);
        setAllTotalPrice(totalPrice);

        const filtered = sortedToys.filter(toy => (
          (!selectedFilters.company || toy.company === selectedFilters.company) &&
          (!selectedFilters.brand || toy.brand === selectedFilters.brand) &&
          (!selectedFilters.series || toy.series === selectedFilters.series) &&
          (!selectedFilters.collection || toy.collection === selectedFilters.collection) &&
          (!selectedFilters.completed || toy.completed === selectedFilters.completed)
        ));

        setFilteredToys(filtered);
      })
      .catch((error) => {
        console.error('Error fetching toys:', error);
      });
  };

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3002');

    // Fetch toys on initial load
    fetchToys();

    // Inside the 'itemAdded' and 'updateItem' event listeners
    socket.on('itemAdded', () => {
      console.log('itemAdded event received on the client');
      // Update the trigger to fetch toys from the server when a new item is added
      setUpdateTrigger((prev) => prev + 1);
    });

    socket.on('updateItem', () => {
      console.log('updateItem event received on the client');
      // Update the trigger to fetch toys from the server when an item is updated or deleted
      setUpdateTrigger((prev) => prev + 1);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      console.log('Disconnected from server via socket');
    };
  }, [selectedFilters, updateTrigger]);

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

  let totalQuantity = 0;
  let totalPrice = 0;
  currentToys.forEach((toy) => {
    totalQuantity += toy.quantity;
    totalPrice += toy.price * toy.quantity;
  });

  const totalToys = toys.reduce((a, v) => a + v.quantity, 0);

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
        Toys by Company


        <div className="totals">
          <div className="total-count">Toy Total: {totalToys}</div>
          {userRole === 'admin' && (
            <>
              <div className="current-page">Collection Total Value: ${allTotalPrice.toFixed(2)}</div>
              <div className="current-page">Current Page Value: ${totalPrice.toFixed(2)}</div>
            </>
          )}
        </div>
      </div>

      <ToysByCompanyContent
        key={updateTrigger}
        currentPage={currentPage}
        toysPerPage={toysPerPage}
        currentToys={currentToys}  // Pass the current toys to the child component
        toys={toys} // Pass all toys to the child component
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

export default ToysByCompany;

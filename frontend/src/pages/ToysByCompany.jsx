import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from '../endpoints/Endpoints';
import socketIOClient from 'socket.io-client'; // Import Socket.IO client library

import ToysByCompanyContent from '../components/content/ToysByCompanyContent';
import { Form, Pagination } from 'react-bootstrap';

const ToysByCompany = () => {
  const [toys, setToys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toysPerPage] = useState(100); // Number of toys to show per page

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

  // Get the user's role from localStorage
  const userRole = localStorage.getItem('userRole');

  // function useForceUpdate() {
  //   const [, setValue] = useState(0); // Destructuring assignment to get the state value
  //   return () => setValue(value => value + 1); // Update the state to force a re-render
  // }

  // const forceUpdate = useForceUpdate(); // Define the useForceUpdate hook


  // useEffect(() => {
  //   console.log('Entering TBC useEffect');

  //   // Establish a Socket.IO connection
  //   const socket = socketIOClient('http://localhost:3002');
  
  //   // Fetch toys from the server
  //   axios.get(endpoints.API_URL + 'toys')
  //     .then((response) => {
  //       const sortedToys = response.data.sort((a, b) => {
  //         const companyComparison = a.company.localeCompare(b.company);
  //         if (companyComparison !== 0) return companyComparison;

  //         const brandComparison = a.brand.localeCompare(b.brand);
  //         if (brandComparison !== 0) return brandComparison;

  //         const seriesComparison = a.series.localeCompare(b.series);
  //         if (seriesComparison !== 0) return seriesComparison;

  //         return a.collection.localeCompare(b.collection);
  //       });
  //       setToys(sortedToys);
  
  //       // Extract filter options, calculate totals, etc.
  //       const companies = [...new Set(sortedToys.map(toy => toy.company))];
  //       const brands = [...new Set(sortedToys.map(toy => toy.brand))];
  //       const series = [...new Set(sortedToys.map(toy => toy.series))];
  //       const collections = [...new Set(sortedToys.map(toy => toy.collection))];
  
  //       companies.sort();
  //       brands.sort();
  //       series.sort();
  //       collections.sort();
  
  //       setFilterOptions({
  //         companies,
  //         brands,
  //         series,
  //         collections
  //       });
  
  //       let totalQuantity = 0;
  //       let totalPrice = 0;
  //       sortedToys.forEach((toy) => {
  //         totalQuantity += toy.quantity;
  //         totalPrice += toy.price * toy.quantity;
  //       });
  
  //       setAllTotalQuantity(totalQuantity);
  //       setAllTotalPrice(totalPrice);
  
  //       // Update the filtered toys based on selected filters
  //       const filtered = sortedToys.filter(toy => (
  //         (!selectedFilters.company || toy.company === selectedFilters.company) &&
  //         (!selectedFilters.brand || toy.brand === selectedFilters.brand) &&
  //         (!selectedFilters.series || toy.series === selectedFilters.series) &&
  //         (!selectedFilters.collection || toy.collection === selectedFilters.collection) &&
  //         (!selectedFilters.completed || toy.completed === selectedFilters.completed)
  //       ));
  
  //       setFilteredToys(filtered);

  //       forceUpdate();
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching toys:', error);
  //     });
  
  //   // Listen for the 'addItem' event
  //   socket.on('addItem', (data) => {
  //     console.log('Received addItem event:', data);

  //     // Fetch toys from the server when a new item is added
  //     axios.get(endpoints.API_URL + 'toys')
  //       .then((response) => {
  //         // Similar logic as above to update toys, filter options, totals, etc.
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching toys:', error);
  //       });
  //   });
  
  //   // Cleanup the socket connection when the component unmounts
  //   return () => {
  //     console.log('Cleaning up socket connection');
  //     socket.disconnect();
  //   };
  // }, [selectedFilters]); // Add selectedFilters as a dependency to update on filter changes

  useEffect(() => {
    console.log('Fetching toys from the server');
    // Establish a Socket.IO connection
    const socket = socketIOClient('http://localhost:3002');
  
    // Function to fetch toys from the server
    const fetchToys = () => {
      axios.get(endpoints.API_URL + 'toys')
      .then((response) => {

        console.log('Fetched toys:', response.data);

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
  
        // Extract filter options, calculate totals, etc.
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
          collections
        });
  
        let totalQuantity = 0;
        let totalPrice = 0;
        sortedToys.forEach((toy) => {
          totalQuantity += toy.quantity;
          totalPrice += toy.price * toy.quantity;
        });
  
        setAllTotalQuantity(totalQuantity);
        setAllTotalPrice(totalPrice);
  
        // Update the filtered toys based on selected filters
        const filtered = sortedToys.filter(toy => (
          (!selectedFilters.company || toy.company === selectedFilters.company) &&
          (!selectedFilters.brand || toy.brand === selectedFilters.brand) &&
          (!selectedFilters.series || toy.series === selectedFilters.series) &&
          (!selectedFilters.collection || toy.collection === selectedFilters.collection) &&
          (!selectedFilters.completed || toy.completed === selectedFilters.completed)
        ));
  
        setFilteredToys(filtered);

        // forceUpdate();
      })
      .catch((error) => {
        console.error('Error fetching toys:', error);
      });
    };
  
    // Fetch toys on initial load
    fetchToys();
  
    // Listen for the 'addItem' event
    socket.on('addItem', () => {
      console.log('addItem event received on the client');
      // Fetch toys from the server when a new item is added
      fetchToys();
    });

    socket.on('newItemAdded', () => {
      console.log('newItemAdded event received on the client');
      // Fetch toys from the server when a new item is added
      fetchToys();
    });
  
    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      console.log('Disconnected from server via socket');
    };
  }, [selectedFilters]); // Add selectedFilters as a dependency to update on filter changes
  
  

  // Calculate the range of pages to display
  const pageRange = 8;
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

  // Gets the total number of toys
  const totalToys = toys.reduce((a, v) => a = a + v.quantity, 0);

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

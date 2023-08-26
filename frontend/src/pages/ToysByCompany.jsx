import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from '../endpoints/Endpoints';

import ToysByCompanyContent from '../components/content/ToysByCompanyContent';
import { Pagination } from 'react-bootstrap';

const ToysByCompany = () => {
  const [toys, setToys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toysPerPage] = useState(50); // Number of toys to show per page

  // Add state for total price and quantity
  const [allTotalQuantity, setAllTotalQuantity] = useState(0);
  const [allTotalPrice, setAllTotalPrice] = useState(0);

  useEffect(() => {
    axios.get(endpoints.API_URL + 'toys')
      .then((response) => {
        const sortedToys = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setToys(sortedToys);

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

  // Calculate the range of pages to display
  const pageRange = 8;
  const totalPages = Math.ceil(toys.length / toysPerPage);

  const startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  // Get current toys for the current page
  const indexOfLastToy = currentPage * toysPerPage;
  const indexOfFirstToy = indexOfLastToy - toysPerPage;
  const currentToys = toys.slice(indexOfFirstToy, indexOfLastToy);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the total price for the currently displayed toys
  let totalQuantity = 0;
  let totalPrice = 0;
  currentToys.forEach((toy) => {
    totalQuantity += toy.quantity;
    totalPrice += toy.price * toy.quantity;
  });

  return (
    <>
      <div className="page-title">
        Toys by Company

        <div className="totals">
          <div>Collection Price: ${allTotalPrice.toFixed(2)}</div>
          <div className="current-page">Current Page Price: ${totalPrice.toFixed(2)}</div>
        </div>
      </div>

      <ToysByCompanyContent
        currentPage={currentPage}
        toysPerPage={toysPerPage}
        currentToys={currentToys}  // Pass the current toys to the child component
        paginate={paginate} // Pass the paginate function to the child component
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

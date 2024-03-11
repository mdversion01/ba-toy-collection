// CustomPagination.jsx
import React from 'react';
import { Pagination } from "react-bootstrap";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageRange = 8;
  const startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  return (
    <div className="pagination-wrapper">
      <Pagination size="sm">
        <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <Pagination.Item
            key={startPage + index}
            active={startPage + index === currentPage}
            onClick={() => onPageChange(startPage + index)}
          >
            {startPage + index}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default CustomPagination;

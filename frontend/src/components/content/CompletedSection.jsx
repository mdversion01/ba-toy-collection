import React from 'react';

const CompletedSection = ({ completed }) => {
  return completed === 'Yes' && <div className="titles__completed">Series Completed</div>;
};

export default CompletedSection;

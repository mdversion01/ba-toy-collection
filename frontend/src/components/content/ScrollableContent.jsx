import React from 'react';
import Thumb from '../content/Thumb';

const ScrollableContent = ({ currentToys }) => {

  return (
    <div className="scrollable-content">
      <div className="toy-list">
        {currentToys.map((toy) => (
           <Thumb 
            key={toy.id} 
            toy={toy}
          />
        ))}
      </div>
    </div>
  );
}

export default ScrollableContent;

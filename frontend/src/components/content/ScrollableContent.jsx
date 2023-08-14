import React from 'react';
import AddedToy from './AddedToy';
import IsVariant from './IsVariant';
import ToyQuantity from './ToyQuantity';

const ScrollableContent = ({ currentToys }) => {
  
  return (
    <div className="scrollable-content">
      <div className="toy-list">
        {currentToys.map((toy) => (
          <div key={toy.id} className="thmb-wrapper">
          <AddedToy 
            date={toy.dateadded}
          />
            <img src={`${toy.src}`} alt={toy.name} style={{ height: '150px' }} />
            <IsVariant variant={toy.variant} />
            <ToyQuantity number={toy.quantity} />

          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollableContent;

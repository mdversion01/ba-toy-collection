import React from 'react';

const ScrollableContent = ({ currentToys }) => {

  return (
    <div className="scrollable-content">
      <div className="toy-list">
        {currentToys.map((toy) => (
          <div key={toy.id} className="thmb-wrapper">
            <img src={`${toy.src}`} alt={toy.name} style={{ height: '150px' }} />
            {toy.variant === 'Yes' && (
              <div className="banner-container">
                <div className="banner">Variant</div>
              </div>
            )}
            {toy.quantity > 1 && (
              <div className="multiple-items">{toy.quantity}</div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollableContent;

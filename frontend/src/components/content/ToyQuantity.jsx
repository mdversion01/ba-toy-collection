import React, { useEffect, useState } from 'react';

const ToyQuantity = ({ number }) => {
  
    const [quantity, setQuantity] = useState(0);
  
    useEffect(() => {
      setQuantity(number);
    }, [number]);
  
    return (
      <>
        {quantity > 1 && (
          <div className="multiple-items">{quantity}</div>
        )}
      </>
    );
  }

export default ToyQuantity;

import React, {useEffect, useState} from 'react';

const IsVariant = ({variant}) => {
  
    const [isVariant, setIsVariant] = useState(false);
  
    useEffect(() => {
      if (variant === 'Yes') {
        setIsVariant(true);
      }
    }, [variant]);
  
    return (
      <>
        {isVariant && (
          <div className="banner-container">
            <div className="banner">Variant</div>
          </div>
        )}
      </>
    );
  }

export default IsVariant;

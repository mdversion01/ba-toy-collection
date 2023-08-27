import React, { useEffect, useRef, useState } from 'react';

const ImageWithDimensions = ({ src, alt }) => {
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const imgRef = useRef(null);

  useEffect(() => {
    const handleImageLoad = () => {
      setImageWidth(imgRef.current.width);
      setImageHeight(imgRef.current.height);
    };

    const image = imgRef.current;
    if (image && image.complete) {
      // If the image is already loaded (cached), we can directly get its dimensions
      handleImageLoad();
    } else if (image) {
      // If the image is still loading, add a listener to get its dimensions once it loads
      image.addEventListener('load', handleImageLoad);
    }

    return () => {
      // Clean up the listener when the component unmounts
      if (image) {
        image.removeEventListener('load', handleImageLoad);
      }
    };
  }, [src]);

  const aspectRatio = imageWidth / imageHeight;
  const imageStyle = {
    width: '100%',
    maxHeight: imageHeight > 800 ? '800px' : '100%',
    objectFit: 'contain',
    aspectRatio: `${aspectRatio}`,
  };

  const divStyle = {
    width: '100%',
    maxHeight: imageHeight > 800 ? '800px' : '100%',
  }

  return (
    <div 
      style={divStyle}
    >
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      style={imageStyle}
    />
    </div>
  );
};

export default ImageWithDimensions;

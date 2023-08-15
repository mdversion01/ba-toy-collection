import React, { useState } from 'react';
import AddedToy from './AddedToy';
import IsVariant from './IsVariant';
import ToyQuantity from './ToyQuantity';
import ThumbModal from '../modal/ThumbModal';

const Thumb = ({ toy }) => {

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleModalOpen = () => {
    setShow(true);
  };

  const handleModalClose = () => {
    setShow(false);
    setEditMode(false);
  };

  return (
    <>
      <div
        className="thmb-wrapper"
        onClick={handleModalOpen}
      >
        <AddedToy date={toy.dateadded} />
        <IsVariant variant={toy.variant} />
        <ToyQuantity number={toy.quantity} />
        
        <img src={toy.src} alt={toy.alt} style={{ height: '150px' }} />
      </div>

      <ThumbModal
        show={show}
        handleModalClose={handleModalClose}
        toy={toy}
        editMode={editMode}
        setEditMode={setEditMode}
      />
    </>
  );
};

export default Thumb;

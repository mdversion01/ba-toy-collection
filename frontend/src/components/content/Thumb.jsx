import React, { useState, useEffect } from "react";
import axios from "axios";
import AddedToy from "./AddedToy";
import IsVariant from "./IsVariant";
import ToyQuantity from "./ToyQuantity";
import ThumbModal from "../modal/ThumbModal";
import { endpoints } from "../../endpoints/Endpoints";

const Thumb = ({ toy }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await axios.get(endpoints.IMG_URL + toy.thumb, {
          responseType: "arraybuffer", // Ensure response is treated as binary data
        });
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setImageUrl(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl(""); // Reset image URL if there's an error
      }
    }

    fetchImage();
  }, [toy.thumb]);

  const handleModalOpen = () => {
    setShow(true);
  };

  const handleModalClose = () => {
    setShow(false);
    setEditMode(false);
  };

  return (
    <>
      <div className="thmb-wrapper" onClick={handleModalOpen}>
        <AddedToy date={toy.dateadded} />
        <IsVariant variant={toy.variant} />
        <ToyQuantity number={toy.quantity} />

        {toy.thumb && imageUrl ? (
          <img src={imageUrl} alt={toy.name} />
        ) : (
          <img src="img/no-thumb.jpg" alt="No Thumb" loading="lazy"/>
        )}
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

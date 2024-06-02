import React, { useState, useEffect } from "react";
import toysData from "../../json/toys.json";
import moment from "moment";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ImageWithDimensions from "./ImageWidthDimensions"; // Fixed import statement

const ThumbModal = ({ toy, show, handleModalClose }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = () => {
      try {
        // Set the image URL directly from the src field
        setImageUrl(`${toy.src}`);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl(""); // Reset image URL if there's an error
      }
    };

    fetchImage();
  }, [toy.src, toy.thumb]);

  const date = moment(toy.dateadded).format("MMMM Do YYYY");

  return (
    <>
      <Modal
        show={show}
        onHide={handleModalClose}
        id={toy.id}
        dialogClassName="modal-dialog-ex"
      >
        <Modal.Header closeButton>
          <Modal.Title>{toy.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="info__container">
            <div className="info__image-wrapper">
              {imageUrl && (
                <ImageWithDimensions
                  className="info__image"
                  src={imageUrl}
                  alt={toy.name}
                />
              )}
            </div>
            <div className="info__content">
              <div className="row g-0">
                <div className="col">
                  <div className="form-group">
                    <label className="title top form-label">Name</label>
                    <div className="form-control form-control-sm">{toy.name}</div>
                  </div>
                </div>
              </div>
              <div className="row g-0">
                <div className="col">
                  <div className="form-group">
                    <label className="title form-label">Current Image Path</label>
                    <div className="form-control form-control-sm">{toy.src}</div>
                  </div>
                </div>
              </div>
              <div className="row g-0">
                <div className="col">
                  <div className="form-group">
                    <label className="title form-label">Company</label>
                    <div className="form-control form-control-sm">{toy.company}</div>
                  </div>
                </div>
              </div>
              <div className="row g-0">
                <div className="col">
                  <div className="form-group">
                    <label className="title form-label">Brand</label>
                    <div className="form-control form-control-sm">{toy.brand}</div>
                  </div>
                </div>
              </div>
              {toy.series && (
                <div className="row g-0">
                  <div className="col">
                    <div className="form-group">
                      <label className="title form-label">Series</label>
                      <div className="form-control form-control-sm">{toy.series}</div>
                    </div>
                  </div>
                </div>
              )}
              {toy.collection && (
                <div className="row g-0">
                  <div className="col">
                    <div className="form-group">
                      <label className="title form-label">Collection</label>
                      <div className="form-control form-control-sm">{toy.collection}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="row g-0">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="title form-label">Year</label>
                    <div className="form-control form-control-sm">{toy.year}</div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-group">
                    <label className="title form-label">Condition</label>
                    <div className="form-control form-control-sm">{toy.toycondition}</div>
                  </div>
                </div>
              </div>
              <div className="row g-0">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="title form-label">Price/Value</label>
                    <div className="form-control form-control-sm">{toy.price}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="title form-label">Quantity</label>
                    <div className="form-control form-control-sm">{toy.quantity}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="title form-label">UPC</label>
                    <div className="form-control form-control-sm">{toy.upc}</div>
                  </div>
                </div>
              </div>
              <div className="row g-0">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="title form-label">Variant</label>
                    <div className="form-control form-control-sm">{toy.variant === "Yes" ? "Yes" : "No"}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="title form-label">Reissue</label>
                    <div className="form-control form-control-sm">{toy.reissue === "Yes" ? "Yes" : "No"}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="title form-label">Completed</label>
                    <div className="form-control form-control-sm">{toy.completed === "Yes" ? "Yes" : "No"}</div>
                  </div>
                </div>
              </div>
              <div className="row g-0">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="title form-label">Notes</label>
                    <div className="form-control form-control-sm">{toy.notes}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col mt-3">
                  <span className="date-added">Date Added: {date}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ThumbModal;

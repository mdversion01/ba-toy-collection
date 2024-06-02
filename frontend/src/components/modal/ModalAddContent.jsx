import React, { useState, useEffect } from "react";
import toysData from "../../json/toys.json"; // Import the JSON file
import { Modal, Button } from "react-bootstrap";

const ModalAddContent = ({ buttonText }) => {
  const [show, setShow] = useState(false);

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [seriesMulti, setSeriesMulti] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState("");

  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState("");

  const [variant, setVariant] = useState("No");
  const [reissue, setReissue] = useState("No");
  const [completed, setCompleted] = useState("No");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("0");
  const [toycondition, setToyCondition] = useState("");
  const [upc, setUpc] = useState("123456789");
  const [dateadded, setDateAdded] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchBrands = () => {
    const uniqueBrands = [...new Set(toysData.map((item) => item.brand))];
    const sortedBrands = uniqueBrands.sort((a, b) => a.localeCompare(b)); // Sort the brand names alphabetically
    setBrands(sortedBrands);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchCompanies = () => {
    const uniqueCompanies = [...new Set(toysData.map((item) => item.company))];
    const sortedCompanies = uniqueCompanies.sort((a, b) => a.localeCompare(b)); // Sort the company names alphabetically
    setCompanies(sortedCompanies);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchSeries = () => {
    const uniqueSeries = [...new Set(toysData.map((item) => item.series))];
    const sortedSeries = uniqueSeries.sort((a, b) => a.localeCompare(b)); // Sort the series names alphabetically
    setSeriesMulti(sortedSeries);
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchCollections = () => {
    const uniqueCollections = [...new Set(toysData.map((item) => item.collection))];
    const sortedCollections = uniqueCollections.sort((a, b) => a.localeCompare(b)); // Sort the collections names alphabetically
    setCollections(sortedCollections);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <>
      <Button variant="link" className="nav-link" onClick={handleShow}>
        {buttonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Toy Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-0">
            <div className="col-md-12">
              <div className="form-group">
                <label>Company</label>
                <div>{selectedCompany}</div>
              </div>
            </div>
          </div>

          <div className="row g-0">
            <div className="col-md-12">
              <div className="form-group">
                <label>Brand</label>
                <div>{selectedBrand}</div>
              </div>
            </div>
          </div>

          <div className="row g-0">
            <div className="col-md-12">
              <div className="form-group">
                <label>Series</label>
                <div>{selectedSeries}</div>
              </div>
            </div>
          </div>

          <div className="row g-0">
            <div className="col-md-12">
              <div className="form-group">
                <label>Collections</label>
                <div>{selectedCollections}</div>
              </div>
            </div>
          </div>

          <div className="row g-0">
            <div className="col-md-4">
              <div className="form-group">
                <label>Year</label>
                <div>{year}</div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-group">
                <label>Condition</label>
                <div>{toycondition}</div>
              </div>
            </div>
          </div>

          <div className="row g-0">
            <div className="col-md-3">
              <div className="form-group">
                <label>Price/Value</label>
                <div>{price}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Quantity</label>
                <div>{quantity}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>UPC</label>
                <div>{upc}</div>
              </div>
            </div>
          </div>

          <div className="row g-0">
            <div className="col-md-4">
              <div className="form-group">
                <label>Variant</label>
                <div>{variant}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Reissue</label>
                <div>{reissue}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Completed</label>
                <div>{completed}</div>
              </div>
            </div>
          </div>

          <div className="row g-0">
            <div className="col-md-12">
              <div className="form-group">
                <label>Notes</label>
                <div>{notes}</div>
              </div>
            </div>
          </div>

          <input type="hidden" value={new Date().toISOString()} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAddContent;

import React, { useState, useEffect } from 'react';
import { endpoints } from '../../endpoints/Endpoints';
import axios from 'axios';
import moment from 'moment';
import validator from 'validator';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ImageWithDimensions from './ImageWidthDimensions'; // Fixed import statement
import Form from 'react-bootstrap/Form';
import FormField from '../forms/FormField';
import TypeaheadEditSelectField from '../forms/TypeaheadEditSelectField';

const ThumbModal = ({
  toy,
  show,
  handleModalClose,
  editMode,
  setEditMode
}) => {
  const [updatedToy, setUpdatedToy] = useState(toy);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [seriesMulti, setSeriesMulti] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const [errors, setErrors] = useState({});

  // Get the user's role from localStorage
  const userRole = localStorage.getItem('userRole');

  // Check if the userRole exists and is not null
  if (userRole) {
    // Do something with the user's role (e.g., store it in state)
    console.log('User role:', userRole);
  } else {
    // Handle the case when the user's role is not found in localStorage
    console.log('User role not found in localStorage');
  }

  const [validationErrors, setValidationErrors] = useState({
    name: '',
    src: '',
    company: '',
    brand: '',
  });

  const validateYear = (year) => {
    if (!validator.isNumeric(year.toString())) {
      return 'Year must be a number';
    }
    const currentYear = new Date().getFullYear();
    if (parseInt(year, 10) > currentYear) {
      return 'Year cannot be in the future';
    }
    return null; // No errors
  };

  const validateQuantity = (quantity) => {
    if (!validator.isNumeric(quantity.toString())) {
      return 'Quantity must be a number';
    }
    return null; // No errors
  };

  const validatePrice = (price) => {
    if (!validator.isNumeric(price) && !validator.isCurrency(price, { allow_negatives: false })) {
      return 'Price must be a number or a valid currency amount';
    }
    return null; // No errors
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!updatedToy.name) {
      validationErrors.name = "A name is required";
    }

    if (!updatedToy.src) {
      validationErrors.src = "Image is required";
    }

    if ((!updatedToy.newBrand && (!selectedBrand || selectedBrand.length === 0)) || !updatedToy.brand) {
      validationErrors.brand = "Brand is required";
    }

    if ((!updatedToy.newCompany && (!selectedCompany || selectedCompany.length === 0)) || !updatedToy.company) {
      validationErrors.company = "Company is required";
    }

    if (!updatedToy.year) {
      validationErrors.year = "Year is required";
    } else {
      const yearError = validateYear(updatedToy.year);
      if (yearError) {
        validationErrors.year = yearError;
      }
    }

    if (!updatedToy.quantity) {
      validationErrors.quantity = "Quantity is required";
    } else {
      const quantityError = validateQuantity(updatedToy.quantity);
      if (quantityError) {
        validationErrors.quantity = quantityError;
      }
    }

    if (!updatedToy.price) {
      validationErrors.price = "Price is required";
    } else {
      const priceError = validatePrice(updatedToy.price);
      if (priceError) {
        validationErrors.price = priceError;
      }
    }

    return validationErrors;
  };

  // Add useEffect to set the updatedToy state with the original toy object when the modal is opened
  useEffect(() => {
    setUpdatedToy(toy);
  }, [toy]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + 'toys');
      const data = response.data;
      const uniqueCompanies = [...new Set(data.map((item) => item.company))];
      const sortedCompanies = uniqueCompanies.sort((a, b) => a.localeCompare(b));
      setCompanies(sortedCompanies);
    } catch (error) {
      console.error('Error fetching companies', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + 'toys');
      const data = response.data;
      const uniqueBrands = [...new Set(data.map((item) => item.brand))];
      const sortedBrands = uniqueBrands.sort((a, b) => a.localeCompare(b));
      setBrands(sortedBrands);
    } catch (error) {
      console.error('Error fetching brands', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchSeriesMulti = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + 'toys');
      const data = response.data;
      const uniqueSeries = [...new Set(data.map((item) => item.series))];
      const sortedSeries = uniqueSeries.sort((a, b) => a.localeCompare(b));
      const seriesMulti = sortedSeries.map((item) => {
        return { label: item, value: item };
      });
      setSeriesMulti(seriesMulti);
    } catch (error) {
      console.error('Error fetching series', error);
    }
  };

  useEffect(() => {
    fetchSeriesMulti();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + 'toys');
      const data = response.data;
      const uniqueCollections = [...new Set(data.map((item) => item.collection))];
      const sortedCollections = uniqueCollections.sort((a, b) => a.localeCompare(b));
      setCollections(sortedCollections);
    } catch (error) {
      console.error('Error fetching collections', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleClose = () => {
    handleModalClose();
  };

  const handleUpdateToy = async () => {
    // Validate form inputs
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Update the validation errors state
      setValidationErrors(validationErrors);
      return;
    }

    try {
      console.log('Updating toy with data:', updatedToy);
      const response = await axios.put(endpoints.API_URL + 'toys/' + updatedToy.id, updatedToy);
      console.log('Response from server:', response.data); // Log the server response
      console.log('Toy updated successfully');
      handleModalClose();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating toy', error);
    }
  };

  const handleCheckboxChange = (name) => {
    if (!editMode) {
      return;
    }

    setUpdatedToy((prevToy) => ({
      ...prevToy,
      [name]: prevToy[name] === 'No' ? 'Yes' : 'No',
    }));
  };

  const handleCompanySelection = (selected) => {
    if (selected.length > 0 && selected[0].customOption) {
      // Selected a new company
      const newCompanyName = selected[0].label;
      setSelectedCompany([newCompanyName]);
      setUpdatedToy({ ...updatedToy, company: newCompanyName });
      setValidationErrors({ ...validationErrors, company: '' });
    } else {
      // Selected an existing company
      setSelectedCompany(selected);
      setUpdatedToy({ ...updatedToy, company: selected[0] || '' });
      setValidationErrors({ ...validationErrors, company: '' });
    }
  };

  const handleDeleteToy = async (id) => {
    try {
      await axios.delete(endpoints.API_URL + 'toys/' + id);
      console.log('Toy deleted successfully');
      handleModalClose();
    } catch (error) {
      console.error('Error deleting toy', error);
    }
  };

  useEffect(() => {
    // Set the selected company based on the initial value from the database
    setSelectedCompany([updatedToy.company]);
  }, [updatedToy.company]);

  const handleBrandSelection = (selected) => {
    if (selected.length > 0 && selected[0].customOption) {
      // Selected a new brand
      const newBrandName = selected[0].label;
      setSelectedBrand([newBrandName]);
      setUpdatedToy({ ...updatedToy, brand: newBrandName });
      setValidationErrors({ ...validationErrors, brand: '' });
    } else {
      // Selected an existing brand
      setSelectedBrand(selected);
      setUpdatedToy({ ...updatedToy, brand: selected[0] || '' });
      setValidationErrors({ ...validationErrors, brand: '' });
    }
  };

  useEffect(() => {
    // Set the selected brand based on the initial value from the database
    setSelectedBrand([updatedToy.brand]);
  }, [updatedToy.brand]);

  const handleSeriesSelection = (selected) => {
    if (selected.length > 0 && selected[0].customOption) {
      // Selected a new series
      const newSeriesName = selected[0].label;
      setSelectedSeries([{ label: newSeriesName, value: newSeriesName }]);
      setUpdatedToy({ ...updatedToy, series: newSeriesName });
    } else {
      // Selected an existing series
      setSelectedSeries(selected);
      setUpdatedToy({ ...updatedToy, series: selected[0]?.label || '' });
    }
  };

  useEffect(() => {
    // Set the selected series based on the initial value from the database
    setSelectedSeries([{ label: updatedToy.series, value: updatedToy.series }]);
  }, [updatedToy.series]);

  const handleCollectionSelection = (selected) => {
    if (selected.length > 0 && selected[0].customOption) {
      // Selected anew collection
      const newCollectionName = selected[0].label;
      setSelectedCollection([newCollectionName]);
      setUpdatedToy({ ...updatedToy, collection: newCollectionName });
    } else {
      // Selected an existing collection
      setSelectedCollection(selected);
      setUpdatedToy({ ...updatedToy, collection: selected[0] || '' });
    }
  };

  useEffect(() => {
    // Set the selected collection based on the initial value from the database
    setSelectedCollection([updatedToy.collection]);
  }, [updatedToy.collection]);

  const date = moment(toy.dateadded).format('MMMM Do YYYY');

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        id={toy.id}
        dialogClassName="modal-dialog-ex"
      >
        <Modal.Header closeButton>
          <Modal.Title>{toy.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="info__container">
            <div className="info__image-wrapper">
              {toy.src && (
                <ImageWithDimensions
                  className="info__image"
                  src={toy.src}
                  alt={toy.name}
                />
              )}
            </div>
            <div className="info__content">
              <Form>
                <div className="row g-0">
                  <div className="col">
                    <FormField
                      addClass={'title top'}
                      label="Name"
                      fmLabel="Name"
                      type="text"
                      value={updatedToy.name}
                      disabled={!editMode}
                      onChange={(e) => {
                        // Clear the validation error for "name" when the user starts typing
                        setValidationErrors({ ...validationErrors, name: '' });
                        setUpdatedToy({ ...updatedToy, name: e.target.value })
                      }}
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      errors={validationErrors.name}
                    />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col">
                    <FormField
                      addClass={'title'}
                      label="Image Path"
                      fmLabel="Image Path"
                      type="text"
                      value={updatedToy.src}
                      disabled={!editMode}
                      onChange={(e) => {
                        // Clear the validation error for "src" when the user starts typing
                        setValidationErrors({ ...validationErrors, src: '' });
                        setUpdatedToy({ ...updatedToy, src: e.target.value })
                      }}
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      errors={validationErrors.src}
                    />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col">
                    <TypeaheadEditSelectField
                      labelName="Company"
                      id="editTypeAheadCompany"
                      nsp="Edit or add new Company."
                      disable={!editMode}
                      options={companies}
                      value={updatedToy.company}
                      placeholder="Type anything..."
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      selectItem={selectedCompany}
                      handler={handleCompanySelection}
                      errors={validationErrors.company}
                    />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col">
                    <TypeaheadEditSelectField
                      labelName="Brand"
                      id="editTypeAheadBrand"
                      nsp="Edit or add new Brand."
                      disable={!editMode}
                      options={brands}
                      value={updatedToy.brand}
                      placeholder="Type anything..."
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      selectItem={selectedBrand}
                      handler={handleBrandSelection}
                      errors={validationErrors.brand}
                    />
                  </div>
                </div>
                {editMode || toy.series ? (
                  <div className="row g-0">
                    <div className="col">
                      <TypeaheadEditSelectField
                        labelName="Series"
                        id="editTypeAheadSeries"
                        nsp="Edit or add new Series."
                        disable={!editMode}
                        options={seriesMulti}
                        value={updatedToy.series}
                        placeholder="Type anything..."
                        fcw={!editMode ? '' : 'form-control-wrapper'}
                        selectItem={selectedSeries}
                        handler={handleSeriesSelection}
                      />
                    </div>
                  </div>
                ) : null}
                {editMode || toy.collection ? (
                  <div className="row g-0">
                    <div className="col">
                      <TypeaheadEditSelectField
                        labelName="Collection"
                        id="editTypeAheadCollection"
                        nsp="Edit or add new Collection."
                        disable={!editMode}
                        options={collections}
                        value={updatedToy.collection}
                        placeholder="Type anything..."
                        fcw={!editMode ? '' : 'form-control-wrapper'}
                        selectItem={selectedCollection}
                        handler={handleCollectionSelection}
                      />
                    </div>
                  </div>
                ) : null}
                <div className="row g-0">
                  <div className="col-md-4">
                    <FormField
                      addClass={'title'}
                      label="Year"
                      fmLabel="Year"
                      type="text"
                      value={updatedToy.year}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, year: e.target.value })
                      }
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      errors={validationErrors.year}
                    />
                  </div>
                  <div className="col-md-8">
                    <FormField
                      addClass={'title'}
                      type="select"
                      label="Condition"
                      fmLabel="Condition"
                      value={updatedToy.toycondition}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({
                          ...updatedToy,
                          toycondition: e.target.value
                        })
                      }
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      options={[
                        { value: 'Mint', label: 'Mint' },
                        { value: 'Near Mint', label: 'Near Mint' },
                        { value: 'Very Good', label: 'Very Good' },
                        { value: 'Good', label: 'Good' },
                        { value: 'Fair', label: 'Fair' },
                        { value: 'Poor', label: 'Poor' }
                      ]}
                    />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col-md-3">
                    <FormField
                      addClass={'title'}
                      label="Price/Value"
                      fmLabel="Price/Value"
                      type="text"
                      value={updatedToy.price}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, price: e.target.value })
                      }
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      errors={validationErrors.price}
                    />
                  </div>
                  <div className="col-md-3">
                    <FormField
                      addClass={'title'}
                      label="Quantity"
                      fmLabel="Quantity"
                      type="text"
                      value={updatedToy.quantity}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, quantity: e.target.value })
                      }
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                      errors={validationErrors.quantity}
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      addClass={'title'}
                      label="UPC"
                      fmLabel="UPC"
                      type="text"
                      value={updatedToy.upc}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, upc: e.target.value })
                      }
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                    />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col-md-4">
                    {/* Use the updatedToy object to display the initial state of the checkbox in default mode */}
                    {!editMode ? (
                      <div className="read-only">
                        Variant: {updatedToy.variant === 'Yes' ? 'Yes' : 'No'}
                      </div>
                    ) : (
                      <FormField
                        label="Variant"
                        type="checkbox"
                        checked={updatedToy.variant === 'Yes'}
                        onChange={() => handleCheckboxChange('variant')}
                        fcw={!editMode ? '' : 'form-control-wrapper'}
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {/* Use the updatedToy object to display the initial state of the checkbox in default mode */}
                    {!editMode ? (
                      <div className="read-only">
                        Reissue: {updatedToy.reissue === 'Yes' ? 'Yes' : 'No'}
                      </div>
                    ) : (
                      <FormField
                        label="Reissue"
                        type="checkbox"
                        checked={updatedToy.reissue === 'Yes'}
                        onChange={() => handleCheckboxChange('reissue')}
                        fcw={!editMode ? '' : 'form-control-wrapper'}
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {/* Use the updatedToy object to display the initial state of the checkbox in default mode */}
                    {!editMode ? (
                      <div className="read-only">
                        Completed: {updatedToy.completed === 'Yes' ? 'Yes' : 'No'}
                      </div>
                    ) : (
                      <FormField
                        label="Completed"
                        type="checkbox"
                        checked={updatedToy.completed === 'Yes'}
                        onChange={() => handleCheckboxChange('completed')}
                        fcw={!editMode ? '' : 'form-control-wrapper'}
                      />
                    )}
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col-md-12">
                    <FormField
                      addClass={'title'}
                      fmLabel="Notes"
                      type="textarea"
                      value={updatedToy.notes}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, notes: e.target.value })
                      }
                      fcw={!editMode ? '' : 'form-control-wrapper'}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mt-3">
                    <span className="date-added">Date Added: {date}</span>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        {userRole === 'admin' && (
            editMode && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you wish to delete this toy?')) {
                      handleDeleteToy(toy.id);
                    }
                  }}
                >
                  Delete Toy
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  onClick={handleUpdateToy}
                >
                  Update Toy
                </Button>
              </>
            )
          )}

          {userRole === 'admin' && (
            <Button
              variant="success"
              onClick={handleEditMode}
              size="sm"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ThumbModal;

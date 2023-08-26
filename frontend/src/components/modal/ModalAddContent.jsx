import React, { useState, useEffect } from 'react';
import { endpoints } from '../../endpoints/Endpoints';  // import the endpoints
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Modal, Button } from 'react-bootstrap';
import TypeaheadSelectField from '../forms/TypeaheadSelectField';
import FormField from '../forms/FormField';

const ModalAddContent = ({ onAddToy, buttonText }) => {

  const [name, setName] = useState('');
  const [src, setSrc] = useState('');
  const [variant, setVariant] = useState('No');
  const [reissue, setReissue] = useState('No');
  const [completed, setCompleted] = useState('No');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('0');
  const [toycondition, setToyCondition] = useState('');
  const [upc, setUpc] = useState('123456789');
  const [dateadded, setDateAdded] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [errors, setErrors] = useState({});

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [newBrand, setNewBrand] = useState('');

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [newCompany, setNewCompany] = useState('');

  const [seriesMulti, setSeriesMulti] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [newSeries, setNewSeries] = useState('');

  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [newCollections, setNewCollections] = useState('');

  const currentDate = new Date().toISOString();

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    clearFormInputs();
  };
  const handleShow = () => setShow(true);

  const fetchBrands = async () => {
    try {
      const response = await fetch(endpoints.API_URL + 'toys'); // Replace with your API endpoint to fetch brands
      const data = await response.json();
      const uniqueBrands = [...new Set(data.map((item) => item.brand))];
      const sortedBrands = uniqueBrands.sort((a, b) => a.localeCompare(b)); // Sort the brand names alphabetically
      setBrands(sortedBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleBrandChange = (selected) => {
    if (selected[0] && selected[0].customOption) {
      // Selected a new brand
      setSelectedBrand([]);
      setNewBrand(selected[0].label);
    } else {
      // Selected an existing brand
      setNewBrand('');
      setSelectedBrand(selected);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(endpoints.API_URL + 'toys'); // Replace with your API endpoint to fetch companies
      const data = await response.json();
      const uniqueCompanies = [...new Set(data.map((item) => item.company))];
      const sortedCompanies = uniqueCompanies.sort((a, b) => a.localeCompare(b)); // Sort the company names alphabetically
      setCompanies(sortedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyChange = (selected) => {
    if (selected[0] && selected[0].customOption) {
      // Selected a new company
      setSelectedCompany([]);
      setNewCompany(selected[0].label);
    } else {
      // Selected an existing company
      setNewCompany('');
      setSelectedCompany(selected);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await fetch(endpoints.API_URL + 'toys'); // Replace with your API endpoint to fetch series
      const data = await response.json();
      const uniqueSeries = [...new Set(data.map((item) => item.series))];
      const sortedSeries = uniqueSeries.sort((a, b) => a.localeCompare(b)); // Sort the series names alphabetically
      setSeriesMulti(sortedSeries);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleSeriesChange = (selected) => {
    if (selected[0] && selected[0].customOption) {
      // Selected a new series
      setSelectedSeries([]);
      setNewSeries(selected[0].label);
    } else {
      // Selected an existing series
      setNewSeries('');
      setSelectedSeries(selected);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch(endpoints.API_URL + 'toys'); // Replace with your API endpoint to fetch collections
      const data = await response.json();
      const uniqueCollections = [...new Set(data.map((item) => item.collection))];
      const sortedCollections = uniqueCollections.sort((a, b) => a.localeCompare(b)); // Sort the collections names alphabetically
      setCollections(sortedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCollectionsChange = (selected) => {
    if (selected[0] && selected[0].customOption) {
      // Selected a new collections
      setSelectedCollections([]);
      setNewCollections(selected[0].label);
    } else {
      // Selected an existing collections
      setNewCollections('');
      setSelectedCollections(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create toyData object to send in the request body
    const toyData = {
      name,
      src,
      brand: selectedBrand[0] || newBrand,
      series: selectedSeries[0] || newSeries,
      collection: selectedCollections[0] || newCollections,
      variant, // Use the state value directly
      reissue, // Use the state value directly
      company: selectedCompany[0] || newCompany,
      year,
      price,
      toycondition: toycondition || 'Mint',
      upc: upc || '123456789',
      dateadded: currentDate,
      notes,
      quantity: quantity || '1',
      completed // Use the state value directly
    };

    // Simulating submitting the data to the database
    submitToysDatabase(toyData);

    // Clear form inputs and reset the newCompany state variable
    clearFormInputs();
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!name) {
      validationErrors.name = "A name is required";
    }

    if (!src) {
      validationErrors.src = "Image is required";
    }

    if (!newBrand && selectedBrand.length === 0) {
      validationErrors.brand = "Brand is required";
    }

    if (!newCompany && selectedCompany.length === 0) {
      validationErrors.company = "Company is required";
    }

    // if (!newSeries && selectedSeries.length === 0) {
    //   validationErrors.series = "A Series is required";
    // }

    // if (!newCollections && selectedCollections.length === 0) {
    //   validationErrors.collections = "A Collection is required";
    // }

    if (!year) {
      validationErrors.year = "Year is required";
    }

    return validationErrors;
  };

  const submitToysDatabase = async (toyData) => {
    const response = await axios.post(endpoints.API_URL + 'toys', toyData);
    const newToy = response.data;
    console.log(newToy);
  };

  // const submitToysDatabase = async (toyData) => {
  //   try {
  //     const response = await axios.post(endpoints.API_URL + 'toys', toyData);
  //     const newToy = response.data;
  //     console.log(newToy);
  //     onAddToy(newToy); // Call the onAddToy function with the newToy
  //     handleClose(); // Close the modal
  //   } catch (error) {
  //     console.error('Error submitting toy:', error);
  //   }
  // };

  const clearFormInputs = () => {
    // Clear form inputs by resetting the state
    setName('');
    setSrc('');
    setSelectedBrand([]);
    setNewBrand('');
    setSelectedSeries([]);
    setNewSeries('');
    setSelectedCollections([]);
    setNewCollections('');
    setVariant('No'); // Set variant to false
    setReissue('No'); // Set reissue to false
    setSelectedCompany([]);
    setNewCompany('');
    setYear('');
    setPrice('0');
    setToyCondition('');
    setUpc('123456789');
    setDateAdded(`${currentDate}`);
    setNotes('');
    setQuantity('1');
    setCompleted('No'); // Set completed to false
    setErrors({});

    fetchCompanies();

    // Manually clear the newBrand value in the Typeahead component
    const typeaheadBrandInput = document.querySelector('#brandTypeahead .rbt-input-main');
    if (typeaheadBrandInput) {
      typeaheadBrandInput.value = '';
    }

    // Manually clear the newCompany value in the Typeahead component
    const typeaheadCompanyInput = document.querySelector('#companyTypeahead .rbt-input-main');
    if (typeaheadCompanyInput) {
      typeaheadCompanyInput.value = '';
    }

    // Manually clear the newSeries value in the Typeahead component
    const typeaheadSeriesInput = document.querySelector('#seriesTypeahead .rbt-input-main');
    if (typeaheadSeriesInput) {
      typeaheadSeriesInput.value = '';
    }

    // Manually clear the newCollections value in the Typeahead component
    const typeaheadCollectionsInput = document.querySelector('#collectionTypeahead .rbt-input-main');
    if (typeaheadCollectionsInput) {
      typeaheadCollectionsInput.value = '';
    }
  };

  // Toggle the boolean value for variant
  const handleVariant = () => {
    setVariant(prevState => (prevState === 'Yes' ? 'No' : 'Yes'));
  };

  // Toggle the boolean value for reissue
  const handleReissue = () => {
    setReissue(prevState => (prevState === 'Yes' ? 'No' : 'Yes'));
  };

  // Toggle the boolean value for completed
  const handleCompleted = () => {
    setCompleted(prevState => (prevState === 'Yes' ? 'No' : 'Yes'));
  };

  const handleToyConditionChange = (e) => {
    setToyCondition(e.target.value);
  };

  useEffect(() => {
    const date = new Date();
    setDateAdded(date);
  }, []);

  return (
    <>
      <Button variant="link" className="nav-link" onClick={handleShow}>
        {buttonText}
      </Button>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Toy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row g-0">
              <div className="col-md-12">
                <FormField
                  addClass={'title'}
                  label="Name"
                  fmLabel="Name"
                  name={name}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name of toy"
                  fcw={'form-control-wrapper'}
                  errors={errors.name}
                />
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-12">
                <FormField
                  addClass={'title'}
                  label="Image Path"
                  fmLabel="Image Path"
                  name={src}
                  type="text"
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                  placeholder="Enter image path"
                  fcw={'form-control-wrapper'}
                  errors={errors.src}
                />
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-12">
                <TypeaheadSelectField
                  labelName="Company"
                  id="companyTypeahead"
                  placeholder="Select or add a company"
                  options={companies}
                  select={selectedCompany}
                  handler={handleCompanyChange}
                  set={setNewCompany}
                  new={newCompany}
                  errors={errors.company}
                />
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-12">
                <TypeaheadSelectField
                  labelName="Brand"
                  id="brandTypeahead"
                  placeholder="Select or add a brand"
                  options={brands}
                  select={selectedBrand}
                  handler={handleBrandChange}
                  set={setNewBrand}
                  new={newBrand}
                  errors={errors.brand}
                />
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-12">
                <TypeaheadSelectField
                  labelName="Series"
                  id="seriesTypeahead"
                  placeholder="Select or add a series"
                  options={seriesMulti}
                  select={selectedSeries}
                  handler={handleSeriesChange}
                  set={setNewSeries}
                  new={newSeries}
                  errors={errors.series}
                />
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-12">
                <TypeaheadSelectField
                  labelName="Collections"
                  id="collectionTypeahead"
                  placeholder="Select or add a collection"
                  options={collections}
                  select={selectedCollections}
                  handler={handleCollectionsChange}
                  set={setNewCollections}
                  new={newCollections}
                  errors={errors.collections}
                />
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-4">
                <FormField
                  addClass={'title'}
                  label="Year"
                  fmLabel="Year"
                  name={year}
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Enter a year"
                  fcw={'form-control-wrapper'}
                  errors={errors.year}
                />
              </div>
              <div className="col-md-8">
                <FormField
                  addClass={'title'}
                  type="select"
                  label="Condition"
                  fmLabel="Condition"
                  value={toycondition}
                  onChange={handleToyConditionChange}
                  fcw={'form-control-wrapper'}
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
                  name={price}
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price/value"
                  fcw={'form-control-wrapper'}
                  errors={errors.price}
                />
              </div>
              <div className="col-md-3">
                <FormField
                  addClass={'title'}
                  label="Quantity"
                  fmLabel="Quantity"
                  name={quantity}
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity."
                  fcw={'form-control-wrapper'}
                  errors={errors.quantity}
                />
              </div>
              <div className="col-md-6">
                <FormField
                  addClass={'title'}
                  label="UPC"
                  fmLabel="UPC"
                  name={upc}
                  type="text"
                  value={upc}
                  onChange={(e) => setUpc(e.target.value)}
                  placeholder="Enter UPC."
                  fcw={'form-control-wrapper'}
                  errors={errors.upc}
                />
              </div>
            </div>

            <div className="row g-0">
        <div className="col-md-4">
          <FormField
            label="Variant"
            type="checkbox"
            checked={variant === 'Yes'} // Use strict comparison for boolean state
            onChange={handleVariant}
            fcw="form-control-wrapper"
          />
        </div>
        <div className="col-md-4">
          <FormField
            label="Reissue"
            type="checkbox"
            checked={reissue === 'Yes'} // Use strict comparison for boolean state
            onChange={handleReissue}
            fcw="form-control-wrapper"
          />
        </div>
        <div className="col-md-4">
          <FormField
            label="Completed"
            type="checkbox"
            checked={completed === 'Yes'} // Use strict comparison for boolean state
            onChange={handleCompleted}
            fcw="form-control-wrapper"
          />
        </div>
      </div>

            <div className="row g-0">
              <div className="col-md-12">
                <FormField
                  addClass={'title'}
                  fmLabel="Notes"
                  type="textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fcw={'form-control-wrapper'}
                />
              </div>
            </div>

            <Form.Control type="hidden" value={currentDate} onChange={(e) => setDateAdded(e.target.value)} />

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" size="sm" onClick={handleSubmit}>
            Add Toy
          </Button>

          <Button variant="outline-secondary" size="sm" onClick={clearFormInputs}>
            Clear
          </Button>

          <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default ModalAddContent;

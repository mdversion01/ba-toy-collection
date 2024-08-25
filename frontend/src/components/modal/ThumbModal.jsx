import React, { useState, useEffect } from "react";
import { endpoints } from "../../endpoints/Endpoints";
import axios from "axios";
import io from "socket.io-client"; // Import socket.io-client
import moment from "moment";
import validator from "validator";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ImageWithDimensions from "./ImageWidthDimensions"; // Fixed import statement
import Form from "react-bootstrap/Form";
import FormField from "../forms/FormField";
import TypeaheadEditSelectField from "../forms/TypeaheadEditSelectField";

const ThumbModal = ({ toy, show, handleModalClose, editMode, setEditMode }) => {
  const [updatedToy, setUpdatedToy] = useState(toy);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [seriesMulti, setSeriesMulti] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  // const [errors, setErrors] = useState({});
  const [socket, setSocket] = useState(null);

  // Get the user's role from localStorage
  const userRole = localStorage.getItem("userRole");

  // Check if the userRole exists and is not null
  // if (userRole) {
  //   // Do something with the user's role (e.g., store it in state)
  //   console.log('User role:', userRole);
  // } else {
  //   // Handle the case when the user's role is not found in localStorage
  //   console.log('User role not found in localStorage');
  // }

  useEffect(() => {
    // Create socket connection when the component mounts
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    // Cleanup the socket connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures that the effect runs only once when the component mounts


  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await axios.get(endpoints.IMG_URL + toy.src, {
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
  }, [toy.src], [toy.thumb]);

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    src: "",
    company: "",
    brand: "",
  });

  const validateYear = (year) => {
    if (!validator.isNumeric(year.toString())) {
      return "Year must be a number";
    }
    const currentYear = new Date().getFullYear();
    if (parseInt(year, 10) > currentYear) {
      return "Year cannot be in the future";
    }
    return null; // No errors
  };

  const validateQuantity = (quantity) => {
    if (!validator.isNumeric(quantity.toString())) {
      return "Quantity must be a number";
    }
    return null; // No errors
  };

  const validatePrice = (price) => {
    if (
      !validator.isNumeric(price) &&
      !validator.isCurrency(price, { allow_negatives: false })
    ) {
      return "Price must be a number or a valid currency amount";
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

    if (
      (!updatedToy.newBrand &&
        (!selectedBrand || selectedBrand.length === 0)) ||
      !updatedToy.brand
    ) {
      validationErrors.brand = "Brand is required";
    }

    if (
      (!updatedToy.newCompany &&
        (!selectedCompany || selectedCompany.length === 0)) ||
      !updatedToy.company
    ) {
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
  // useEffect(() => {
  //   setUpdatedToy(toy);
  // }, [toy]);
  useEffect(() => {
    // Ensure the price field is a string
    const updatedToyWithPriceAsString = {
      ...toy,
      price: toy.price.toString(),
    };
    setUpdatedToy(updatedToyWithPriceAsString);
  }, [toy]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + "toys");
      const data = response.data;
      const uniqueCompanies = [...new Set(data.map((item) => item.company))];
      const sortedCompanies = uniqueCompanies.sort((a, b) =>
        a.localeCompare(b)
      );
      setCompanies(sortedCompanies);
    } catch (error) {
      console.error("Error fetching companies", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + "toys");
      const data = response.data;
      const uniqueBrands = [...new Set(data.map((item) => item.brand))];
      const sortedBrands = uniqueBrands.sort((a, b) => a.localeCompare(b));
      setBrands(sortedBrands);
    } catch (error) {
      console.error("Error fetching brands", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchSeriesMulti = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + "toys");
      const data = response.data;
      const uniqueSeries = [...new Set(data.map((item) => item.series))];
      const sortedSeries = uniqueSeries.sort((a, b) => a.localeCompare(b));
      const seriesMulti = sortedSeries.map((item) => {
        return { label: item, value: item };
      });
      setSeriesMulti(seriesMulti);
    } catch (error) {
      console.error("Error fetching series", error);
    }
  };

  useEffect(() => {
    fetchSeriesMulti();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(endpoints.API_URL + "toys");
      const data = response.data;
      const uniqueCollections = [
        ...new Set(data.map((item) => item.collection)),
      ];
      const sortedCollections = uniqueCollections.sort((a, b) =>
        a.localeCompare(b)
      );
      setCollections(sortedCollections);
    } catch (error) {
      console.error("Error fetching collections", error);
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

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  // const [thumbnailUrl , setThumbnailUrl ] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type (allow only JPG, JPEG, and PNG)
    if (file && /\.(jpe?g|png)$/i.test(file.name)) {
      setImageFile(file);
    } else {
      // Handle invalid file type error
      console.error('Invalid file type. Please upload a JPG, JPEG, or PNG file.');
      // Clear the selected file
      e.target.value = null;
    }
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
      let updatedToyWithNewImage = { ...updatedToy };
  
      if (imageFile) {
        // Check if there's an existing image to delete
        if (toy.src) {
          try {
            // Delete the old image
            await axios.post(endpoints.API_URL + "delete-image", { src: toy.src });
          } catch (error) {
            console.error("Error deleting old image:", error);
            // Optionally, handle the error (e.g., notify the user)
          }
        }

        if (toy.thumb) {      
          try {
            // Delete the old thumbnail
            await axios.post(endpoints.API_URL + "delete-image", { src: toy.thumb });
          } catch (error) {
            console.error("Error deleting old thumbnail:", error);
            // Optionally, handle the error (e.g., notify the user)
          }
        }
  
        const formData = new FormData();
        formData.append("image", imageFile);
  
        try {
          const imageUploadResponse = await axios.post(
            endpoints.API_URL + "upload-image",
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
  
          const { imageUrl, thumbnailUrl  } = imageUploadResponse.data; // Get the uploaded image URL
          updatedToyWithNewImage.src = imageUrl;
          updatedToyWithNewImage.thumb = thumbnailUrl ;
        } catch (error) {
          console.error("Error uploading new image:", error);
          // Handle the error scenario if needed
        }
      }
  
      // Perform the PUT request with the updatedToyWithNewImage data
      // const response = await axios.put(
      //   endpoints.API_URL + "toys/" + updatedToy.id,
      //   updatedToyWithNewImage
      // );
      await axios.put(
        endpoints.API_URL + "toys/" + updatedToy.id,
        updatedToyWithNewImage
      );
  
      // Emit a socket event after the toy is updated
      socket.emit('toyUpdated', { toyId: updatedToy.id });
  
      handleModalClose();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating toy", error);
    }
  };  

  const handleCheckboxChange = (name) => {
    if (!editMode) {
      return;
    }

    setUpdatedToy((prevToy) => ({
      ...prevToy,
      [name]: prevToy[name] === "No" ? "Yes" : "No",
    }));
  };

  const handleCompanySelection = (selected) => {
    if (selected.length > 0 && selected[0].customOption) {
      // Selected a new company
      const newCompanyName = selected[0].label;
      setSelectedCompany([newCompanyName]);
      setUpdatedToy({ ...updatedToy, company: newCompanyName });
      setValidationErrors({ ...validationErrors, company: "" });
    } else {
      // Selected an existing company
      setSelectedCompany(selected);
      setUpdatedToy({ ...updatedToy, company: selected[0] || "" });
      setValidationErrors({ ...validationErrors, company: "" });
    }
  };

  const handleDeleteToy = async (id, src) => {
    try {
      // Delete the toy record from the database
      await axios.delete(endpoints.API_URL + "toys/" + id);
  
      // Now, request the backend to delete the image file using the src information
      await axios.post(endpoints.API_URL + "delete-image", { src });
  
      // Emit a socket event after the toy and its image are deleted
      socket.emit('toyDeleted', { toyId: id });
  
      handleModalClose();
    } catch (error) {
      console.error("Error deleting toy or its image", error);
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
      setValidationErrors({ ...validationErrors, brand: "" });
    } else {
      // Selected an existing brand
      setSelectedBrand(selected);
      setUpdatedToy({ ...updatedToy, brand: selected[0] || "" });
      setValidationErrors({ ...validationErrors, brand: "" });
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
      setUpdatedToy({ ...updatedToy, series: selected[0]?.label || "" });
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
      setUpdatedToy({ ...updatedToy, collection: selected[0] || "" });
    }
  };

  useEffect(() => {
    // Set the selected collection based on the initial value from the database
    setSelectedCollection([updatedToy.collection]);
  }, [updatedToy.collection]);

  const date = moment(toy.dateadded).format("MMMM Do YYYY");

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
              {imageUrl && (
                <ImageWithDimensions
                  className="info__image"
                  src={imageUrl}
                  alt={toy.name}
                />
              )}
            </div>
            <div className="info__content">
              <Form>
                <div className="row g-0">
                  <div className="col">
                    {!editMode ? (
                      <>
                        <div className="title top form-label">Name</div>
                        <div className="form-control form-control-sm" disabled>
                          {toy.name}
                        </div>
                      </>
                    ) : (
                      <FormField
                        addClass={"title top"}
                        label="Name"
                        fmLabel="Name"
                        type="text"
                        value={updatedToy.name}
                        disabled={!editMode}
                        onChange={(e) => {
                          // Clear the validation error for "name" when the user starts typing
                          setValidationErrors({
                            ...validationErrors,
                            name: "",
                          });
                          setUpdatedToy({
                            ...updatedToy,
                            name: e.target.value,
                          });
                        }}
                        fcw={!editMode ? "" : "form-control-wrapper"}
                        errors={validationErrors.name}
                      />
                    )}
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col">
                    
                      <>
                        <div className="title form-label">Current Image Path</div>
                        <div className="form-control form-control-sm" disabled>
                          {toy.src}
                        </div>
                      </>
                      {!editMode ? '' : (
                      <FormField
                        addClass={"title"}
                        label="Upload New Image"
                        fmLabel="Upload Image"
                        type="file"
                        //accept="image/*"
                        onChange={handleImageChange}
                        fcw={!editMode ? "" : "form-control-wrapper"}
                      />
                    )}
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
                      fcw={!editMode ? "" : "form-control-wrapper"}
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
                      fcw={!editMode ? "" : "form-control-wrapper"}
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
                        fcw={!editMode ? "" : "form-control-wrapper"}
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
                        fcw={!editMode ? "" : "form-control-wrapper"}
                        selectItem={selectedCollection}
                        handler={handleCollectionSelection}
                      />
                    </div>
                  </div>
                ) : null}
                <div className="row g-0">
                  <div className="col-md-4">
                    <FormField
                      addClass={"title"}
                      label="Year"
                      fmLabel="Year"
                      type="text"
                      value={updatedToy.year}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, year: e.target.value })
                      }
                      fcw={!editMode ? "" : "form-control-wrapper"}
                      errors={validationErrors.year}
                    />
                  </div>
                  <div className="col-md-8">
                    <FormField
                      addClass={"title"}
                      type="select"
                      label="Condition"
                      fmLabel="Condition"
                      value={updatedToy.toycondition}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({
                          ...updatedToy,
                          toycondition: e.target.value,
                        })
                      }
                      fcw={!editMode ? "" : "form-control-wrapper"}
                      options={[
                        { value: "Mint", label: "Mint" },
                        { value: "Near Mint", label: "Near Mint" },
                        { value: "Very Good", label: "Very Good" },
                        { value: "Good", label: "Good" },
                        { value: "Fair", label: "Fair" },
                        { value: "Poor", label: "Poor" },
                      ]}
                    />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col-md-3">
                    <FormField
                      addClass={"title"}
                      label="Price/Value"
                      fmLabel="Price/Value"
                      type="text"
                      value={updatedToy.price}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({
                          ...updatedToy,
                          price: String(e.target.value),
                        })
                      }
                      fcw={!editMode ? "" : "form-control-wrapper"}
                      errors={validationErrors.price}
                    />
                  </div>
                  <div className="col-md-3">
                    <FormField
                      addClass={"title"}
                      label="Quantity"
                      fmLabel="Quantity"
                      type="text"
                      value={updatedToy.quantity}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({
                          ...updatedToy,
                          quantity: e.target.value,
                        })
                      }
                      fcw={!editMode ? "" : "form-control-wrapper"}
                      errors={validationErrors.quantity}
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      addClass={"title"}
                      label="UPC"
                      fmLabel="UPC"
                      type="text"
                      value={updatedToy.upc}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, upc: e.target.value })
                      }
                      fcw={!editMode ? "" : "form-control-wrapper"}
                    />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col-md-4">
                    {/* Use the updatedToy object to display the initial state of the checkbox in default mode */}
                    {!editMode ? (
                      <div className="read-only">
                        Variant: {updatedToy.variant === "Yes" ? "Yes" : "No"}
                      </div>
                    ) : (
                      <FormField
                        label="Variant"
                        type="checkbox"
                        checked={updatedToy.variant === "Yes"}
                        onChange={() => handleCheckboxChange("variant")}
                        fcw={!editMode ? "" : "form-control-wrapper"}
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {/* Use the updatedToy object to display the initial state of the checkbox in default mode */}
                    {!editMode ? (
                      <div className="read-only">
                        Reissue: {updatedToy.reissue === "Yes" ? "Yes" : "No"}
                      </div>
                    ) : (
                      <FormField
                        label="Reissue"
                        type="checkbox"
                        checked={updatedToy.reissue === "Yes"}
                        onChange={() => handleCheckboxChange("reissue")}
                        fcw={!editMode ? "" : "form-control-wrapper"}
                      />
                    )}
                  </div>
                  <div className="col-md-4">
                    {/* Use the updatedToy object to display the initial state of the checkbox in default mode */}
                    {!editMode ? (
                      <div className="read-only">
                        Completed:{" "}
                        {updatedToy.completed === "Yes" ? "Yes" : "No"}
                      </div>
                    ) : (
                      <FormField
                        label="Completed"
                        type="checkbox"
                        checked={updatedToy.completed === "Yes"}
                        onChange={() => handleCheckboxChange("completed")}
                        fcw={!editMode ? "" : "form-control-wrapper"}
                      />
                    )}
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col-md-12">
                    <FormField
                      addClass={"title"}
                      fmLabel="Notes"
                      type="textarea"
                      value={updatedToy.notes}
                      disabled={!editMode}
                      onChange={(e) =>
                        setUpdatedToy({ ...updatedToy, notes: e.target.value })
                      }
                      fcw={!editMode ? "" : "form-control-wrapper"}
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
          {userRole === "admin" && editMode && (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you wish to delete this toy?")
                  ) {
                    handleDeleteToy(toy.id, toy.src);
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
          )}

          {userRole === "admin" && (
            <Button variant="success" onClick={handleEditMode} size="sm">
              {editMode ? "Cancel" : "Edit"}
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ThumbModal;

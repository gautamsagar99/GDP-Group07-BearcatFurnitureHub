import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import "../ProductDetailsPage/ProductDetails.css";
import Button from "../../components/Button/Button";
import { UpdateFurniture } from "../../utils/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [setSearchQuery] = useState("");
  const [productStatus, setProductStatus] = useState(null);
  const resetSearchQuery = () => {
    setSearchQuery(""); // Reset the search query to an empty string
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/get-furniture/${productId}`)
      .then((response) => {
        console.log("Response data:", response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [productId]);

  const handleRequestClick = () => {
    setIsRequesting(true);
    const requestData = {
      id: product.id,
      name: product.name,
      furniture_condition: product.furniture_condition,
      years_used: product.years_used,
      image_url: product.image_url,
      furniture_type: product.furniture_type,
      furniture_description: product.furniture_description,
      status: "requested",
      userEmail: localStorage.getItem("LoggedInUser"),
    };
    console.log("requestData", requestData);

    // Call the function from api.js to make the Axios request
    const response = UpdateFurniture(requestData);
    console.log(response);
  };

  const handleMessageClick = () => {};

  const handleSuccessfulDonationClick = () => {};

  const handleDeleteClick = () => {
    axios
      .delete(`http://localhost:5000/delete-furniture/${productId}`)
      .then((response) => {
        console.log("Response data:", response.data);
        if (response.data.message === "Furniture marked as deleted") {
          console.log("Furniture deleted successfully");
          window.location.href = "/home";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCancelClick = async () => {
      const requestData = {
        id: product.id,
        name: product.name,
        furniture_condition: product.furniture_condition,
        years_used: product.years_used,
        image_url: product.image_url,
        furniture_type: product.furniture_type,
        furniture_description: product.furniture_description,
        status: "cancelled",
        userEmail: localStorage.getItem("LoggedInUser"),
      };
      console.log("requestData", requestData);
  
      // Call the function from api.js to make the Axios request
      const responseResult = await UpdateFurniture(requestData);
      console.log("response from method", responseResult);
      if(responseResult === true){
        setIsRequesting(false);
        setProductStatus("available")
      }
      
    
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  let buttonsToRender = null;
  console.log("status", product.status);
  console.log("email", product.user_email);

  if (
    product.status === "available" &&
    product.user_email === localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
      <div className="button-container">
        <Button
          type="button"
          label="Edit Furniture"
          // Add onClick handler for editing here
          color="edit"
        />
        <Button
          type="button"
          label="Delete Furniture"
          onClick={handleDeleteClick}
          color="danger"
        />
      </div>
    );
  } else if (
    (product.status === "available"  || productStatus === "available") &&  !isRequesting &&
    product.user_email !== localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
      <Button
        type="button"
        label="Request Furniture"
        onClick={handleRequestClick}
        color="primary"
      />
    );
  } else if (
    (product.status === "requested") &&
    product.user_email !== localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
    <div className="button-container">
      <Button
        type="button"
        label="Message"
        onClick={handleMessageClick}
        color="primary"
      />
      <Button
        type="button"
        label="Cancel Request"
        onClick={handleCancelClick}
        color="danger"
      />
    </div>
    );
    
  } else if (
    product.status === "requested" &&
    product.user_email === localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
      <div className="button-container">
        <Button
          type="button"
          label="Message"
          onClick={handleMessageClick}
          color="message"
        />
        <Button
          type="button"
          label="Donated Successfully"
          onClick={handleSuccessfulDonationClick}
          color="primary"
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar onSearch={setSearchQuery} onResetSearch={resetSearchQuery} />
      <div className="product-details-container">
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Years Used: {product.years_used}</p>
          <p>Furniture Condition: {product.furniture_condition}</p>
          <p>Description: {product.furniture_description}</p>
          <br />
          {isRequesting ? (
            <div className="button-container">
              <Button
                type="button"
                label="Message"
                onClick={handleMessageClick}
                color="primary"
              />
              <Button
                type="button"
                label="Cancel Request"
                onClick={handleCancelClick}
                color="danger"
              />
            </div>
          ) : (
            buttonsToRender // Render the appropriate buttons here
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

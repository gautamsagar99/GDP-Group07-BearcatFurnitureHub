import React from 'react';
import './MyRequests.css';
import { UpdateFurniture } from "../../utils/api";

const MyRequests = ({ id, imageSrc, label, condition, status, removeCard }) => {
    const handleMessageClick = () => {};
  const handleCancelRequestClick = () => {
    const requestData = {
      id: id,
      status: "cancelled",
      userEmail: localStorage.getItem("LoggedInUser"),
    };

    console.log("requestData", requestData);

    // Call the function from api.js to make the Axios request
    UpdateFurniture(requestData)
      .then((result) => {
        console.log("response", result);
        if (result === true) {
          // Remove the card if the request is successful
          removeCard(id);
        } else {
          // Handle other cases if needed
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error:", error);
      });
  };

  return (
    <div className="card-rectangular-myrequests">
      <div className="card-image-myrequests">
        <img src={imageSrc} alt={label} />
      </div>
      <div className="card-details-myrequests">
        <p className="card-name-myrequests">{label}</p>
        <p className="card-condition-myrequests">Condition: {condition}</p>
        <p className="card-status-myrequests">Status: {status}</p>
        <br />
        <div className="button-container-myrequests">
          <button className="message-button-myrequests" onClick={handleMessageClick}>
            Message
          </button>
          <button className="cancel-button-myrequests" onClick={handleCancelRequestClick}>
            Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;

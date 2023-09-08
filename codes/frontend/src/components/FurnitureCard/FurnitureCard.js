import React from 'react';
import { useNavigate } from "react-router-dom";
import './FurnitureCard.css'; // Import the CSS file

const FurnitureCard = ({ imageSrc, label, description, onButtonClick }) => {
  const navigate = useNavigate();
  onButtonClick = () => {
    navigate("/ProductDetails");
  };
  return (
    <div className="card">
      <img src={imageSrc} alt={label} className="card-image" />
      {/* <h2 className="card-label">{label}</h2> */}
      <p className="card-description">{description}</p>
      <div className="card-button-container">
        <button className="card-button" onClick={onButtonClick}>
          Get the Product
        </button>
      </div>
    </div>
  );
};



export default FurnitureCard;

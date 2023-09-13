import React from 'react';
import { Link } from 'react-router-dom';
import './FurnitureCard.css';

const FurnitureCard = ({ productId, imageSrc, label, description }) => {
  return (
    <div className="card">
      <img src={imageSrc} alt={label} className="card-image" />
      <p className="card-description">{description}</p>
      <div className="card-button-container">
        <Link to={`/product/${productId}`} className="card-button">
          Get the Product
        </Link>
      </div>
    </div>
  );
};

export default FurnitureCard;

import React from 'react';
import './MyDonations.css';

const MyDonations = ({ imageSrc, label, condition, status }) => {
  return (
    <div className="card-rectangular-mydonations">
      <div className="card-image-mydonations">
        <img src={imageSrc} alt={label} />
      </div>
      <div className="card-details-mydonations">
        <p className="card-name-mydonations">{label}</p>
        {/* <p className="card-condition-mydonations">Condition: {condition}</p> */}
        <p className="card-status-mydonations">Status: Successfully Donated</p>
      </div>
    </div>
  );
};

export default MyDonations;

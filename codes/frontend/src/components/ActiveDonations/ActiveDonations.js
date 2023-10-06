import React from 'react';
import './ActiveDonations.css';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
// import { FaEnvelope } from 'react-icons/fa';


const ActiveDonations = ({ productId, imageSrc, label, condition, status }) => {
  let statusIcon = null;
  
  if (status === 'requested') {
    // Display an envelope icon when status is requested
    // statusIcon = <FaEnvelope />;
  } else if (status === 'available') {
    // Display a pencil icon when status is available
    statusIcon = <FaEdit />;
  }

  return (
    <div className="card-rectangular-activedonations">
      <div className="card-icon-activedonations">{statusIcon}</div>
      <div className="card-image-activedonations">
        <img src={imageSrc} alt={label} />
      </div>
      <div className="card-details-activedonations">
        <p className="card-name-activedonations">{label}</p>
        <p className="card-condition-activedonations">Condition: {condition}</p>
        <p className="card-status-activedonations">Status: {status}</p>
        <br></br>
        <Link to={{
    pathname: `/product/${productId}`,
    state: { fromActiveDonations: true }, // Pass a state indicating navigation from ActiveDonations
  }}
   className="card-button-activedonations">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ActiveDonations;

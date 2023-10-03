import React from 'react';

const UserDetails = ({ first_name, last_name, email }) => {
  return (
    <div className="user-card">
      <h2>Welcome {first_name} {last_name}</h2>
    </div>
  );
};

export default UserDetails;

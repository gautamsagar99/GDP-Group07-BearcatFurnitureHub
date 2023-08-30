import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ label, onClick, color }) => {
  const buttonClass = `button ${color}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.string.isRequired,
};

export default Button;

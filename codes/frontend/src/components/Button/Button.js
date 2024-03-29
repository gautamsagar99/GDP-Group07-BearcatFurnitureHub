import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ label, onClick, color, type }) => {
  const buttonClass = `button ${color}`;

  return (
    <button className={buttonClass} onClick={onClick} type={type}>
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default Button;

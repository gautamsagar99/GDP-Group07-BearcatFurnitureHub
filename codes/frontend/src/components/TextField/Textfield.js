import React from 'react';
import PropTypes from 'prop-types';
import './Textfield.css';

const TextField = ({ label, value, onChange, placeholder, name, type, required}) => {
  return (
    <div className="text-field">
      <label>{label} {required && <span className="required">*</span>}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} name={name}/>
    </div>
  );
};

TextField.propTypes = {
  // label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // required: PropTypes.bool.isRequired
};

export default TextField;

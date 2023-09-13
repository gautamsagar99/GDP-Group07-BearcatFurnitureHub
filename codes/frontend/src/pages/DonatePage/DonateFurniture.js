import React from 'react';
import './DonateFurniture.css'; 
import Navbar from '../../components/Navbar';
import Button from '../../components/Button/Button';

const DonateFurniture = () => {
  // ... (your component code)

  return (
	<div>
		<Navbar/>
	
    <div className="container">
      <h2 className="text-center">Donate Furniture</h2>
      <form 
	//   onSubmit={handleSubmit}
	  >
        <div className="form-group">
          <label htmlFor="productName">Product Name: </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            name="productName"
            // value={formData.productName}
            // onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="yearsUsed">Years Used: </label>
          <select
            className="form-control"
            id="yearsUsed"
            name="yearsUsed"
            // value={formData.yearsUsed}
            // onChange={handleInputChange}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="condition">Furniture Condition: </label>
          <select
            className="form-control"
            id="condition"
            name="condition"
            // value={formData.condition}
            // onChange={handleInputChange}
          >
            <option value="Good">Good</option>
            <option value="Bad">Bad</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="furnitureType">Furniture Type: </label>
          <select
            className="form-control"
            id="furnitureType"
            name="furnitureType"
            // value={formData.furnitureType}
            // onChange={handleInputChange}
          >
            <option value="Sofa">Sofa</option>
            <option value="Table">Table</option>
            <option value="Fan">Fan</option>
            <option value="Lamp">Lamp</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Furniture Description: </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            // value={formData.description}
            // onChange={handleInputChange}
            required
          />
        </div>
		<br></br>
        <div className="form-group">
          <label htmlFor="image">Upload Image: </label>
          <input
            type="file"
            className="form-control-file"
            id="image"
            name="image"
            accept="image/*"
            // onChange={handleImageUpload}
          />
        </div>
        <div className="form-group">
          <Button type='button'  label="Donate" color='primary'>
          </Button>
        </div>
      </form>
    </div>
	</div>
  );
};

export default DonateFurniture;

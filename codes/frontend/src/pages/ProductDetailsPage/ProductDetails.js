import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import '../ProductDetailsPage/ProductDetails.css';
import Button from '../../components/Button/Button';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [setSearchQuery] = useState('');
  const resetSearchQuery = () => {
    setSearchQuery(''); // Reset the search query to an empty string
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/get-furniture/${productId}`)
      .then((response) => {
        console.log('Response data:', response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [productId]);

  const handleRequestClick = () => {
    setIsRequesting(true);
  };

  const handleMessageClick = () => {
  };

  const handleCancelRequestClick = () => {
    setIsRequesting(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar onSearch={setSearchQuery} onResetSearch={resetSearchQuery}/> 
      <div className="product-details-container">
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Years Used: {product.years_used}</p>
          <p>Furniture Condition: {product.furniture_condition}</p>
          <p>Description: {product.furniture_description}</p>
          <br></br>
          {isRequesting ? (
            <div className="button-container">
              <Button type="button" label="Message" onClick={handleMessageClick} color="primary" />
              <Button type="button" label="Cancel Request" onClick={handleCancelRequestClick} color="danger" />
            </div>
          ) : (
            <Button type="button" label="Request Furniture" onClick={handleRequestClick} color="primary" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

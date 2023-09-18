import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import Index from '../../components/Navbar/index';
import axios from 'axios';
import '../ProductDetailsPage/ProductDetails.css'
import Button from "../../components/Button/Button";

const ProductDetails = () => {
  const { productId } = useParams(); // Get the productId from the route

  const [product, setProduct] = useState(null);
  const [showMessageCancelBtn, setShowMessageCancelBtn] = useState(false);

  useEffect(() => {
    // Fetch product details based on the product ID using Axios
    axios.get(`http://localhost:5000/get-furniture/${productId}`)
      .then(response => {
        console.log('Response data:', response.data);
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }
  var isRequested = () =>{
    setShowMessageCancelBtn(true);
  } 

  return (
    <div>
      <Index />
      <div className="product-details-container">
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Years Used: {product.years_used}</p>
          <p>Furniture Condition: {product.furniture_condition}</p>
          <Button type='button' label="Request Furniture" onClick={isRequested} color='primary'/>

          {showMessageCancelBtn ? (
          <div row-4>
          <Button type='button' label="Message" color='primary'/>
          <Button type='button' label="Cancel Request" color='red'/>
          </div>
          ):(<p></p>)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

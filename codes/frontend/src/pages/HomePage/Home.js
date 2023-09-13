import React, { useState, useEffect } from 'react';
import './Home.css';
import FurnitureCard from '../../components/FurnitureCard/FurnitureCard';
import axios from 'axios';
import Navbar from '../../components/Navbar';

function Home() {
  const [furnitureData, setFurnitureData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/get-furniture')
      .then(response => {
        console.log('Response data:', response.data);
        setFurnitureData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
      <Navbar/>
      <div className="card-container">
        {furnitureData.map((item, index) => (
          <FurnitureCard
            key={index}
            productId={item.id}
            imageSrc={item.image_url}
            label={item.name}
            description={item.name}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;

import React from 'react';
// import {Navbar, Nav, FormControl, Button } from 'react-bootstrap'; // Assuming you're using React Bootstrap
import './Home.css';
import furniture from '../../assets/images/sofa.jpg';
import Index from '../../components/Navbar/index'
import FurnitureCard from '../../components/FurnitureCard/FurnitureCard';

// const Home = () => {
//   return (
//     <div>

//     <Index/>

//     <div>
//       <br></br>
//     </div>
//     <div>     Showing all products</div>
//       <FurnitureCard
//         imageSrc={furniture}
//         // label="Comfy Sofa"
//         description="A comfortable sofa for your living room."
//         // onButtonClick={handleButtonClick}
//       />
//     </div>
//   );
// };

// export default Home;

// import React from 'react';
// import FurnitureCard from './FurnitureCard'; // Import the FurnitureCard component if not already imported

function ProductList() {
  // Define the number of times you want to repeat the component
  const numberOfTimes = 3; // Change this to the desired number of repetitions

  // Create an array to store the repeated components
  const productComponents = [];

  for (let i = 0; i < numberOfTimes; i++) {
    // Push the repeated components into the array
    productComponents.push(
      <div style={{ display: 'flex' }}>
        {/* First set of div and FurnitureCard */}
        <div style={{ display: 'flex'  }}>
          
          <FurnitureCard
            imageSrc={furniture}
            description="A comfortable sofa for your living room."
          />
          <FurnitureCard
            imageSrc={furniture}
            description="A comfortable sofa for your living room."
          />
          <FurnitureCard
            imageSrc={furniture}
            description="A comfortable sofa for your living room."
          />
        </div>

        {/* Second set of div and FurnitureCard */}
        <div style={{ marginRight: '20px' }}>
          <FurnitureCard
            imageSrc={furniture}
            description="A comfortable sofa for your living room."
          />
        </div>

      </div>

    );
  }

  return (
    <div>
      <Index />
      <div>
        {productComponents}
      </div>
      <div>Showing all products</div>

    </div>
  );
}

export default ProductList;


import React, { useState, useEffect, useRef } from "react";
import "./DonateFurniture.css";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button/Button";
import { CreateFurniture, EditFurniture } from "../../utils/api";
import { CSSTransition } from "react-transition-group";

const DonateFurniture = () => {
  const [name, setName] = useState("");
  const [yearsUsed, setYearsUsed] = useState("1");
  const [condition, setCondition] = useState("Good");
  const [Category, setCategory] = useState("Sofa");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const userEmail = localStorage.getItem("LoggedInUser");

  const fileInputRef = useRef(null);

  const [showFurnitureDonatedMessage, setShowFurnitureDonatedMessage] =
    useState(false);
  
    const productId = localStorage.getItem("Product_id");
    var isUpdating = false;

  useEffect(() => {
    const savedName = localStorage.getItem('Product_Name');
    const savedYearsUsed = localStorage.getItem('Product_Years');
    const savedCondition = localStorage.getItem('Product_Condition');
    const savedCategory = localStorage.getItem('Product_Type');
    const savedDescription = localStorage.getItem('Product_Description');

    if (savedName) {
      setName(savedName);
    }
    if (savedYearsUsed) {
      setYearsUsed(savedYearsUsed);
    }
    if (savedCondition) {
      setCondition(savedCondition);
    }
    if (savedCategory) {
      setCategory(savedCategory);
    }
    if (savedDescription) {
      setDescription(savedDescription);
    }
    if (showFurnitureDonatedMessage) {
      const timer = setTimeout(() => {
        setShowFurnitureDonatedMessage(false);
      }, 3000); // 5000 milliseconds (5 seconds)
      return () => clearTimeout(timer);
    }
  }, [showFurnitureDonatedMessage]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleYearsUsedChange = (e) => {
    setYearsUsed(e.target.value);
  };

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object with all the form data
    const formData = new FormData();
    formData.append("id", productId);
    formData.append("name", name);
    formData.append("yearsUsed", yearsUsed);
    formData.append("condition", condition);
    formData.append("category", Category);
    formData.append("furniture_description", description);
    formData.append("image", image);
    formData.append("userEmail", userEmail);

    // Send formData to the server using your API function
    var responseResult = "";
    if(productId === ""){
      isUpdating = true;
      localStorage.setItem("Product_id", "");
      localStorage.setItem("Product_Name", "");
      localStorage.setItem("Product_Years", "1");
      localStorage.setItem("Product_Condition", "Good");
      localStorage.setItem("Product_Type", "Sofa");
      localStorage.setItem("Product_Description", "");  
      responseResult = await CreateFurniture(formData);

    }
    else{
      responseResult = await EditFurniture(formData);
    }
    

    if (responseResult === true) {
      console.log("Furniture Created Successfully");
      setImage(null);
      localStorage.setItem("Product_id", "");
    localStorage.setItem("Product_Name", "");
    localStorage.setItem("Product_Years", "1");
    localStorage.setItem("Product_Condition", "Good");
    localStorage.setItem("Product_Type", "Sofa");
    localStorage.setItem("Product_Description", "");
      setName("");
      setYearsUsed("1");
      setCondition("Good");
      setCategory("Sofa");
      setDescription("");
      setImage(null);
      fileInputRef.current.value = null;
      setShowFurnitureDonatedMessage(!showFurnitureDonatedMessage);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <CSSTransition
          in={showFurnitureDonatedMessage}
          timeout={30}
          classNames="fade"
          unmountOnExit
        >
          {/* <div className="furnitureaddedpopup">
            Furniture Added Successfully
          </div> */}
          <div className="furnitureaddedpopup">
          {isUpdating ? "Furniture Added Successfully" : "Furniture Updated Successfully"}
          </div>
        </CSSTransition>
        {/* <h2 className="text-center">Donate Furniture</h2> */}
        <h2 className="text-center">{productId ? "Update Furniture" : "Donate Furniture"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name: </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="yearsUsed">Years Used: </label>
            <select
              className="form-control"
              id="yearsUsed"
              name="yearsUsed"
              value={yearsUsed}
              onChange={handleYearsUsedChange}
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
              value={condition}
              onChange={handleConditionChange}
            >
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category">Furniture Type: </label>
            <select
              className="form-control"
              id="category"
              name="category"
              value={Category}
              onChange={handleCategoryChange}
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
              value={description}
              onChange={handleDescriptionChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload Image: </label>
            <input
              type="file"
              className="form-control-file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef} 
            />
          </div>
          <div className="form-group">
            {/* <Button type="submit" label="Donate" color="primary">
              Donate
            </Button> */}
            <Button type="submit" label={productId ? "Update" : "Donate"} color="primary">
              {productId ? "Update" : "Donate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateFurniture;

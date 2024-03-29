import React, { useState, useEffect } from "react";
import "./Home.css";
import FurnitureCard from "../../components/FurnitureCard/FurnitureCard";
import Navbar from "../../components/Navbar";
import { getFurnitures } from "../../utils/api";

function Home() {
  const [furnitureData, setFurnitureData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userEmail = localStorage.getItem("LoggedInUser");
  const resetSearchQuery = () => {
    setSearchQuery(""); // Reset the search query to an empty string
  };

  useEffect(() => {
    localStorage.setItem("Product_id", "");
    localStorage.setItem("Product_Name", "");
    localStorage.setItem("Product_Years", "1");
    localStorage.setItem("Product_Condition", "Good");
    localStorage.setItem("Product_Type", "Sofa");
    localStorage.setItem("Product_Description", "");
    
    console.log(localStorage.getItem("jwtToken") + "in home page ");
    const fun = async () => {
      const res = await getFurnitures(userEmail);
      setFurnitureData(res.data);
      console.log(res);
      console.log("in home");
    };

    fun();
    //   axios
    //     .get("http://localhost:5000/get-all-furniture/" + userEmail, {
    //       headers: {
    //         "Access-Control-Allow-Headers": "*",
    //         "Access-Control-Allow-Origin": "*",
    //         "Content-Type": "application/json",
    //         "Authorization": localStorage.getItem("jwtToken")
    //       },
    //     })
    //     .then((response) => {
    //       console.log("Response data:", response.data);
    //       setFurnitureData(response.data);
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //     });
  }, [userEmail]);

  const filteredFurniture = furnitureData.filter((item) => {
    const lowerSearchQuery = searchQuery.toLowerCase().trim(); // Trim whitespace from the search query
    const lowerItemName = item.name.toLowerCase().trim(); // Trim whitespace from the item's name
    const lowerItemType = item.furniture_type.toLowerCase().trim();
    const furnitureCondition = item.furniture_condition.toLowerCase().trim(); // Trim whitespace from furniture_condition
    const furnitureDescription = item.furniture_description
      .toLowerCase()
      .trim();
    const searchQueryWords = lowerSearchQuery.split(" "); // Split lowerSearchQuery into individual words

    const conditionMatches = lowerSearchQuery.includes(furnitureCondition); // Check if the furniture condition matches the search query
    // console.log("conditionMatches",conditionMatches);
    // console.log("furnitureDescription",furnitureDescription);
    const descriptionMatches = searchQueryWords.every((word) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, "i"); // Match whole word with case-insensitivity
      return wordRegex.test(furnitureDescription);
    });

    // console.log("descriptionMatches",descriptionMatches);

    const nameMatches = searchQueryWords.every((word) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, "i"); // Match whole word with case-insensitivity
      return wordRegex.test(lowerItemName);
    });
    // console.log("nameMatches",nameMatches);

    const typeMatches = searchQueryWords.some((word) =>
      lowerItemType.includes(word)
    );
    // console.log("typeMatches",typeMatches);

    if (nameMatches) {
      return nameMatches;
    }

    if (descriptionMatches) {
      return descriptionMatches;
    } else if (conditionMatches && nameMatches && descriptionMatches) {
      return conditionMatches && nameMatches && descriptionMatches;
    } else if (conditionMatches && typeMatches && descriptionMatches) {
      return conditionMatches && typeMatches && descriptionMatches;
    } else if (conditionMatches && nameMatches) {
      return conditionMatches && nameMatches;
    } else if (conditionMatches && typeMatches) {
      return conditionMatches && typeMatches;
    }
    return false;
  });

  //useEffect to enable to scroll on home page
  useEffect(() => {
    // Set a class on the body when the component mounts
    document.body.classList.add("custom-body-class");

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("custom-body-class");
    };
  }, []);

  return (
    <div>
      <Navbar onSearch={setSearchQuery} onResetSearch={resetSearchQuery} />{" "}
      {/* Pass setSearchQuery to Navbar */}
      {filteredFurniture.length === 0 ? ( // Check if no products are found
        <div style={{ textAlign: "center", marginTop: "250px" }}>
          <p>Sorry! No products found.</p>
        </div>
      ) : (
        <div className="card-container">
          {searchQuery === ""
            ? furnitureData.map((item, index) => (
                <FurnitureCard
                  key={index}
                  productId={item.id}
                  imageSrc={item.image_url}
                  label={item.name}
                  description={item.furniture_description}
                />
              ))
            : filteredFurniture.map((item, index) => (
                <FurnitureCard
                  key={index}
                  productId={item.id}
                  imageSrc={item.image_url}
                  label={item.name}
                  description={item.furniture_description}
                />
              ))}
        </div>
      )}
    </div>
  );
}

export default Home;

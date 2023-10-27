import React, { useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import "../ProductDetailsPage/ProductDetails.css";
import Button from "../../components/Button/Button";
import { UpdateFurniture } from "../../utils/api";
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {db} from "../../utils/firebase"
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [setSearchQuery] = useState("");
  const [productStatus, setProductStatus] = useState(null);
  const [showFurnitureCancelledMessage, setShowFurnitureCancelledMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [username, setUsername] = useState("");
  //const [newuser, setNewUser] = useState(null);
  //const [currentUser, setCurrentUser] = useState(null);
  const [err, setErr] = useState(false);
 // const [showChatPage, setShowChatPage] = useState(false);
 let donor = {};
 let currentUser = {};
 const currentUserEmail=localStorage.getItem("LoggedInUser");
 

  const resetSearchQuery = () => {
    setSearchQuery(""); // Reset the search query to an empty string
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (showFurnitureCancelledMessage) {
      const timer = setTimeout(() => {
        setShowFurnitureCancelledMessage(false);
      }, 3000); // 5000 milliseconds (5 seconds)
      return () => clearTimeout(timer);
    }
  }, [showFurnitureCancelledMessage]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/get-furniture/${productId}`)
      .then((response) => {
        console.log("Response data:", response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [productId]);

  

  const handleRequestClick =  async () =>  {
    
    const requestData = {
      id: product.id,
      name: product.name,
      furniture_condition: product.furniture_condition,
      years_used: product.years_used,
      image_url: product.image_url,
      furniture_type: product.furniture_type,
      furniture_description: product.furniture_description,
      status: "requested",
      userEmail: localStorage.getItem("LoggedInUser"),
    };
    console.log("requestData", requestData);

    // Call the function from api.js to make the Axios request
    const responseResult = await UpdateFurniture(requestData);
    console.log("response from method", responseResult);
    if(responseResult === true){
      setIsRequesting(true);
      setShowFurnitureCancelledMessage(!showFurnitureCancelledMessage);
      setMessageText("Furniture Requested Successfully");
    }
  };



  const handleMessageClick = async () => {
    console.log("entered message click")
    const q = query(
      collection(db, "users"),
      where("email", "==", product.user_email)
    );

    const q2 = query(
      collection(db, "users"),
      where("email", "==", currentUserEmail)
    );

    try {
      console.log("entered try")
      const querySnapshot = await getDocs(q);
      console.log("names",querySnapshot.size)
      querySnapshot.forEach((doc) => {
        console.log("data: ",doc.data())
        //setNewUser(doc.data());
       // console.log("name",user.firstname);
       donor=doc.data();
        console.log("entered for each")
      });
      console.log("donor",donor);
    } catch (err) {
      console.log(err)
      setErr(true);
    }
  

  try {
    const query2Snapshot = await getDocs(q2);
    query2Snapshot.forEach((doc) => {
      currentUser=doc.data();
    });
    console.log(currentUser);
  } catch (err) {
    setErr(true);
  }

    const combinedId = currentUserEmail < product.user_email ? currentUserEmail + product.user_email : product.user_email + currentUserEmail;
    const sanitizedCombinedId = combinedId.replace(/[.$#[\]/@]/g, "_");
        try {
          const res = await getDoc(doc(db, "chats", sanitizedCombinedId));
          if (res.exists()) {
            const updateData2 = {
              [sanitizedCombinedId + '.date']: serverTimestamp(), // Partial update for the 'date' field
            };
            
            await updateDoc(doc(db, "userChat", currentUserEmail), updateData2);
          }
    
          if (!res.exists()) {
            //create a chat in chats collection
            await setDoc(doc(db, "chats", sanitizedCombinedId), { messages: [] });
    
            //create user chats
            // await updateDoc(doc(db, "userChat", currentUser), {
            //   [combinedId + ".userInfo"]: {
            //     name:user.firstname
            //   },
            //   [combinedId + ".date"]: serverTimestamp(),
            // });
            const updateData = {
              [sanitizedCombinedId]: {
                userInfo: {
                  name: donor.firstname+" "+donor.lastname,
                  email:product.user_email
                },
                date: serverTimestamp()
              }
            };
            
            await updateDoc(doc(db, "userChat", currentUserEmail), updateData);
            
    
            await updateDoc(doc(db, "userChat", product.user_email), {
              [sanitizedCombinedId + ".userInfo"]: {
                name:currentUser.firstname+" "+currentUser.lastname,
                email:currentUser.email
              },
              [sanitizedCombinedId + ".date"]: serverTimestamp(),
            });
          }
        } catch (err) {}
    
        //setNewUser(null);
       // setUsername("")
       await new Promise((resolve) => setTimeout(resolve, 100));
        navigate("/Chat")
      };

    
  

  const handleSuccessfulDonationClick =  async () =>  {
    
    const requestData = {
      id: product.id,
      name: product.name,
      furniture_condition: product.furniture_condition,
      years_used: product.years_used,
      image_url: product.image_url,
      furniture_type: product.furniture_type,
      furniture_description: product.furniture_description,
      status: "closed",
      userEmail: localStorage.getItem("LoggedInUser"),
    };
    console.log("requestData", requestData);

    // Call the function from api.js to make the Axios request
    const responseResult = await UpdateFurniture(requestData);
    console.log("response from method", responseResult);
    if(responseResult === true){
      setIsRequesting(false);
      setShowFurnitureCancelledMessage(!showFurnitureCancelledMessage);
      setProductStatus("closed")
      setMessageText("Furniture Donated Successfully");
    }};

  const handleDeleteClick = () => {
    axios
      .delete(`http://localhost:5000/delete-furniture/${productId}`)
      .then((response) => {
        console.log("Response data:", response.data);
        if (response.data.message === "Furniture marked as deleted") {
          setMessageText("Furniture deleted successfully");
          console.log("Furniture deleted successfully");
          setProductStatus("deleted")
          setIsRequesting(false);
          setMessageText("Furniture deleted successfully");
          setRedirectToHome(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCancelClick = async () => {
      const requestData = {
        id: product.id,
        name: product.name,
        furniture_condition: product.furniture_condition,
        years_used: product.years_used,
        image_url: product.image_url,
        furniture_type: product.furniture_type,
        furniture_description: product.furniture_description,
        status: "cancelled",
        userEmail: localStorage.getItem("LoggedInUser"),
      };
      console.log("requestData", requestData);
  
      // Call the function from api.js to make the Axios request
      const responseResult = await UpdateFurniture(requestData);
      console.log("response from method", responseResult);
      if(responseResult === true){
        setIsRequesting(false);
        setProductStatus("available")
        setShowFurnitureCancelledMessage(!showFurnitureCancelledMessage);
        setMessageText("Furniture Cancelled Successfully");
      }
      
    
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  let buttonsToRender = null;
  localStorage.setItem("DonorEmail",product.user_email);
  console.log("status", product.status);
  console.log("email", product.user_email);

  if( productStatus === "closed" || productStatus === "deleted"){
    buttonsToRender = (
      <div>

      </div>
    );
  }
  else if (
    product.status === "available" &&
    product.user_email === localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
      <div className="button-container">
        <Button
          type="button"
          label="Edit Furniture"
          // Add onClick handler for editing here
          color="edit"
        />
        <Button
          type="button"
          label="Delete Furniture"
          onClick={handleDeleteClick}
          color="danger"
        />
      </div>
    );
  } else if (
    (product.status === "available"  || productStatus === "available") &&  !isRequesting &&
    product.user_email !== localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
      <Button
        type="button"
        label="Request Furniture"
        onClick={handleRequestClick}
        color="primary"
      />
    );
  } else if (
    (product.status === "requested") &&
    product.user_email !== localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
    <div className="button-container">
      <Button
        type="button"
        label="Message"
        onClick={handleMessageClick}
        color="primary"
      />
      <Button
        type="button"
        label="Cancel Request"
        onClick={handleCancelClick}
        color="danger"
      />
    </div>
    );
    
  } else if (
    product.status === "requested" &&
    product.user_email === localStorage.getItem("LoggedInUser")
  ) {
    buttonsToRender = (
      <div className="button-container">
        <Button
          type="button"
          label="Message"
          onClick={handleMessageClick}
          color="messageButton"
        />
        <Button
          type="button"
          label="Donated Successfully"
          onClick={handleSuccessfulDonationClick}
          color="primary"
        />
      </div>
    );
  }
  

  return (
    <div>
      <Navbar onSearch={setSearchQuery} onResetSearch={resetSearchQuery} />
      {redirectToHome && <Navigate to="/home" />}
      <div className="product-details-container">
      <CSSTransition in={showFurnitureCancelledMessage} timeout={30}  classNames="fade"  unmountOnExit>
        <div className="furniturecancelledpopup">
          {messageText}
        </div>
      </CSSTransition>
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Years Used: {product.years_used}</p>
          <p>Furniture Condition: {product.furniture_condition}</p>
          <p>Description: {product.furniture_description}</p>
          <br />
          {isRequesting ? (
            <div className="button-container">
              <Button
                type="button"
                label="Message"
                onClick={handleMessageClick}
                color="primary"
              />
              
              <Button
                type="button"
                label="Cancel Request"
                onClick={handleCancelClick}
                color="danger"
              />
            </div>
          ) : (
            buttonsToRender // Render the appropriate buttons here
          )}
        </div>
      </div>
    </div>
  );
};


export default ProductDetails;

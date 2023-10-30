import React from "react";
import Navbar from "../../components/Navbar/index";
import Tab from "../../components/Tabs/Tabs";
import { useEffect, useState } from "react";
import "./ProfileDetails.css";
import UserDetails from "../../components/UserDetails/UserDetails";
import { getUserDetails } from "../../utils/api";

const ProfileDetails = () => {
  //code to enable scroll
  useEffect(() => {
    localStorage.setItem("Product_id", "");
    localStorage.setItem("Product_Name", "");
    localStorage.setItem("Product_Years", "1");
    localStorage.setItem("Product_Condition", "Good");
    localStorage.setItem("Product_Type", "Sofa");
    localStorage.setItem("Product_Description", "");
    // Set a class on the body when the component mounts
    document.body.classList.add("custom-body-class-profilePage");

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("custom-body-class-profilePage");
    };
  }, []);

  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();

        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
    return () => {
      // Cleanup function (if needed)
      // You can add any cleanup code here
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div>
      <Navbar />

      <UserDetails
        first_name={userDetails.first_name}
        last_name={userDetails.last_name}
        email="johndoe@example.com"
      />

      <Tab />
    </div>
  );
};

export default ProfileDetails;

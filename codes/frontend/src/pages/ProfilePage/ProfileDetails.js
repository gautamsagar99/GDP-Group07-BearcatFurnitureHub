import React from "react";
import Navbar from "../../components/Navbar/index";
import Tab from "../../components/Tabs/Tabs";
import { useEffect } from "react";
import "./ProfileDetails.css";

const ProfileDetails = () => {
  //code to enable scroll
  useEffect(() => {
    // Set a class on the body when the component mounts
    document.body.classList.add("custom-body-class-profilePage");

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("custom-body-class-profilePage");
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Tab />
    </div>
  );
};

export default ProfileDetails;

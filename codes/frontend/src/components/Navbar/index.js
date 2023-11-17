import React, { useState, useEffect } from "react";
// import {
// 	Nav,
// 	NavLink,
// 	NavMenu,
// 	NavHome,
// 	NavBtn,
// 	NavBtnLink,
// 	SearchInput,
// 	NavNotificationBtnLink,
// 	SearchBtnLink
// } from './NavbarElements';
import { NavLink as Link } from "react-router-dom";
import "./Navbar.css";
import { FaUser, FaEnvelope } from "react-icons/fa";
// import { FaBell } from 'react-icons/fa';

const Navbar = ({ onSearch, onResetSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    console.log("toggled");
    setShowLinks(!showLinks);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };
  const allProducts = () => {
    if (searchQuery !== "") {
      onResetSearch();
      // setSearchQuery = ""
      // onSearch(" ");
      document.getElementById("searchInput").placeholder =
        "Search for products";
      setSearchQuery("");
    }
  };
  // const bellIconStyle = {
  // 	color: 'white', // Change the color to white
  // 	fontSize: '24px', // Increase the font size
  // };
  const profileIconStyle = {
    color: "white", // Change the color to white
    fontSize: "24px", // Increase the font size
  };
  const messageIconStyle = {
    color: "white", // Change the color to white
    fontSize: "24px", // Increase the font size
  };

  useEffect(() => {
    // Add an event listener to detect window resize
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Close the links container when the screen size is larger than 768px
        setShowLinks(false);
      }
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="nav">
        <Link className="home" to="/home" onClick={allProducts}>
          <b>Bearcat Furniture Hub</b>
        </Link>

        <Link className="custom-link" to="/home" onClick={allProducts}>
          All Products
        </Link>
        <Link className="custom-link" to="/DonateFurniture">
          Donate Furniture
        </Link>

        <input
          className="search-input"
          type="text"
          id="searchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search By Product Name, Description and Condition"
        ></input>

        <Link className="searchLink" onClick={handleSearch}>
          Search
        </Link>

        <Link className="custom-link nav-notification-btn-link" to="/Chat">
          <FaEnvelope style={messageIconStyle} />
        </Link>
        <Link
          className="custom-link nav-notification-btn-link"
          to="/ProfileDetails"
        >
          <FaUser style={profileIconStyle} />
        </Link>

        <Link className="custom-link signout" to="/">
          Signout
        </Link>
        <div className="hamburger" onClick={toggleLinks}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>
      {showLinks && (
        <div className="links-container">
          <Link className="links" to="/home" onClick={allProducts}>
            All Products
          </Link>
          <Link className="links" to="/DonateFurniture">
            Donate Furniture
          </Link>
          <Link className="links" to="/ProfileDetails">
            Profile
          </Link>
          <Link className="links" to="/">
            Signout
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;

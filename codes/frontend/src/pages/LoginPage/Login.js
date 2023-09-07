import React, { useState } from "react";

import Button from "../../components/Button/Button";

import TextField from "../../components/TextField/Textfield";

import Form from "react-bootstrap/Form";

import "./Login.css";

import furniture from "../../assets/images/mainImage.jpg";

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import CryptoJS from 'crypto-js';


const Login = () => {
  const [data, setData] = useState({ emailAddress: "", password: "" });
  // const [showValidationMessage, setShowValidationMessage] = useState(false);

  const { emailAddress, password } = data;

  const encryptionKey = 'bearcathubkey'; 

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/signup");
  };




  const handleLogin = async () => {
    
    if (emailAddress.length === 0) {
      alert("Email Address is required");
    } else if (!emailAddress.includes("nwmissouri.edu")) {
      alert("Invalid Email");
    } else if (password.length === 0) {
      // setShowValidationMessage(true);
    } else {
      const encryptedEmail = CryptoJS.AES.encrypt(emailAddress,encryptionKey).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password,encryptionKey).toString();

    axios.post('http://localhost:5000/login', {
      email: encryptedEmail,
      password: encryptedPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {

      console.log(response.data); // Handle the response data
      
      if(response.data&&response.data.token)
      {
        const jwtToken=response.data.token;
        localStorage.setItem("jwtToken",jwtToken)
      }
      if (response.data === 'Login successful') {
        // Assuming you have the 'navigate' function available
        navigate('/home');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

      // const output = await fetch("http://localhost:3000/test");

      // console.log(`output using ftech api ${output.text()}`);

      console.log(
        "write logic for sending login details to server using api(http:localhost:8080/login) with axios module"
      );
    }
  };

  const onchange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div className="form-center">
      <img src={furniture} alt="Logo" className="logo"></img>

      <Form>
        <h1>
          Welcome to <br/>Bearcat<br/> Furniture Hub
        </h1>

        <Form.Group className="mb-3" controlId="formBasicEmail">


          <TextField
            type="email"
            value={emailAddress}
            label="Email Address"
            name="emailAddress"
            placeholder="Email Address"
            onChange={onchange}
            required={true}
          />

          {emailAddress.length > 0 &&
            !emailAddress.includes("nwmissouri.edu") && (
              <span className="error" style={{ color: "red", display: "block" }}>
                Please enter @nwmissouri.edu email
              </span>
            )}
        </Form.Group>
        <br/>
        <br/>

        <Form.Group className="mb-3" controlId="formBasicPassword">

          <TextField
            type="password"
            value={password}
            label="Password"
            name="password"
            placeholder="Password"
            onChange={onchange}
            required={true}
          />
        </Form.Group>
         <br/>
        <br/>
      
        <Button type="button" label="Login" onClick={handleLogin} color="primary"/>

        

        <Button type="button" label="SignUp" onClick={handleRegister} color="primary"/>

        <br/>

        <br/>

        <a href="/enter-email" className="forgotpassword">
          <u>Forgot Password?</u>
        </a>
      </Form>
    </div>
  );
};

export default Login;

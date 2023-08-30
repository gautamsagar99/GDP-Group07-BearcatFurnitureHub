import React, { useState } from "react";

import Button from "../../components/Button/Button";

import TextField from "../../components/TextField/Textfield";

import Form from "react-bootstrap/Form";

import "./Login.css";

import furniture from "../../assets/images/mainImage.jpg";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ emailAddress: "", password: "" });
  // const [showValidationMessage, setShowValidationMessage] = useState(false);

  const { emailAddress, password } = data;

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
      fetch("http://localhost:5000/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email: emailAddress, password: password }),
      })
        .then((response) => response.text())

        .then((text) => {
          console.log(text); // Handle the response text

          //alert(text);
          if (text === "Login successful") {
            navigate("/home");
          }
        })

        .catch((error) => {
          console.error(error); // Handle any errors
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
      
        <Button label="Login" onClick={handleLogin} color="primary"/>

        <br/>

        <br/>

        <Button label="SignUp" onClick={handleRegister} color="primary"/>

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

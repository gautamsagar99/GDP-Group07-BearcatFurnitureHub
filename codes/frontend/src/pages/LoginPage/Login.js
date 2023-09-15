import React, { useState } from "react";

import Button from "../../components/Button/Button";

import TextField from "../../components/TextField/Textfield";

import Form from "react-bootstrap/Form";

import "./Login.css";

import furniture from "../../assets/images/B3.png";

import { useNavigate } from "react-router-dom";

import CryptoJS from "crypto-js";
import { loginPost } from "../../utils/api";

const Login = () => {
  const [data, setData] = useState({ emailAddress: "", password: "" });
  // const [showValidationMessage, setShowValidationMessage] = useState(false);

  const { emailAddress, password } = data;

  const encryptionKey = "1234";

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/signup");
  };

  const handleLogin = async () => {
    const iv = "1234";
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);

    if (emailAddress.length === 0) {
      alert("Email Address is required");
    } else if (!emailAddress.includes("nwmissouri.edu")) {
      alert("Invalid Email");
    } else if (password.length === 0) {
      // setShowValidationMessage(true);
    } else {
      const encryptedEmail = CryptoJS.AES.encrypt(emailAddress, encryptionKey, {
        iv: ivBytes,
      }).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey, {
        iv: ivBytes,
      }).toString();

      const body = {
        encryptedEmail: encryptedEmail,
        encryptedPassword: encryptedPassword,
      };
      if (loginPost(body)) {
        navigate("/home");
      }
      //  loginPost(body)
      //  .then((response)=>{
      //   if(response.data === "Login successful")
      //   {
      //     navigate("/home");
      //   }
      //  })
      // axios
      //   .post(
      //     "http://localhost:5000/login",
      //     {
      //       encryptedEmail: encryptedEmail,
      //       encryptedPassword: encryptedPassword,
      //     },
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   )
      //   .then((response) => {
      //     console.log(response.data); // Handle the response data

      //     if (response.data && response.data.token) {
      //       const jwtToken = response.data.token;
      //       localStorage.setItem("jwtToken", jwtToken);
      //     }
      //     if (response.data === "Login successful") {
      //       // Assuming you have the 'navigate' function available
      //       navigate("/home");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });

      // const output = await fetch("http://localhost:3000/test");

      // console.log(`output using ftech api ${output.text()}`);
    }
  };

  const onchange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div className="form-center">

<<<<<<< HEAD
      <Form className="rightFormContainer">
=======
      <div className="logoDiv">
      <img src={furniture} alt="Logo" className="logo"></img>
   
      </div>

<div className="formDiv">
  <Form className="rightFormContainer">
>>>>>>> sanjay-frontend
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <TextField
            type="email"
            value={emailAddress}
            // label="Email Address"
            name="emailAddress"
            placeholder="Email Address"
            onChange={onchange}
            // required={true}
          />

          {emailAddress.length > 0 &&
            !emailAddress.includes("nwmissouri.edu") && (
              <span
                className="error"
                style={{ color: "red", display: "block" }}
              >
                Please enter @nwmissouri.edu email
              </span>
            )}

            
        </Form.Group>
        <br />

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <TextField
            type="password"
            value={password}
            // label="Password"
            name="password"
            placeholder="Password"
            onChange={onchange}
            // required={true}
          />
        </Form.Group>
        <br />

        <Button
          type="button"
          label="Login"
          onClick={handleLogin}
          color="primary"
        />
<<<<<<< HEAD
        <br />

        <a href="/enter-email" className="forgotpassword">
          Forgot Password?
        </a>
        <br />
=======
        <br/>
      
      <div className="forgotpassword">
      <a href="/enter-email">
        Forgot Password?
        </a>
      </div>

        {/* <a href="/enter-email" className="forgotpassword">
        Forgot Password?
        </a> */}
      <br />
      
>>>>>>> sanjay-frontend

        <Button
          type="button"
          label="Signup"
          onClick={handleRegister}
          color="primary"
        />
        <br />
<<<<<<< HEAD
      </Form>
=======

     
      </Form></div>
      
>>>>>>> sanjay-frontend
    </div>
  );
};

export default Login;

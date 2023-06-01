import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import img from "./image.jpg";
import "./ResetPassword.css";

const EmailAdress = () => {
  const [data, setData] = useState({ emailAddress: "" });
  const { emailAddress } = data;
  let nav = useNavigate();

  const onchange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const handleCode = async () => {
    if (emailAddress.length === 0) {
      alert("Email Address is required");
    } else if (!emailAddress.includes("nwmissouri.edu")) {
      alert("Invalid Email");
    } else {
      console.log("inside email address");
      // localStorage.setItem("email", emailAddress);
      fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress,
        }),
      })
        .then((response) => response.json())
        .then((text) => {
          console.log(text.message + "displaying message"); // Handle the response text
          //   alert(text);

          if (text.message === "Password reset token generated and sent.") {
            nav("/forgot-password");
          }
        })
        .catch((error) => {
          console.error(error); // Handle any errors
        });
    }
  };

  return (
    <div className="form-inmiddle">
      <img src={img} alt="Logo" className="imglogo"></img>
      <Form>
        <Form.Group className="mb-3" controlId="forgotpasswordEmail">
          <Form.Label className="label">
            Email address <span style={{ color: "red" }}>*</span>
          </Form.Label>

          <Form.Control
            type="email"
            value={emailAddress}
            name="emailAddress"
            placeholder="Email Address"
            onChange={onchange}
            style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}
          />

          {emailAddress.length > 0 &&
            !emailAddress.includes("nwmissouri.edu") && (
              <span style={{ color: "red", display: "block" }}>
                Please enter @nwmissouri.edu email
              </span>
            )}
        </Form.Group>
        <br />
        <Button className="otpbutton" onClick={handleCode}>
          Send Code
        </Button>
      </Form>
    </div>
  );
};

export default EmailAdress;

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import img from "../../assets/images/mainImage.jpg";
import "./ResetPassword.css";
import Button from "../../components/Button/Button";

import TextField from "../../components/TextField/Textfield";
import { EmailAddressPost } from "../../utils/api";
import CryptoJS from "crypto-js";

const EmailAdress = () => {
  const [data, setData] = useState({ emailAddress: "" });
  const { emailAddress } = data;
  const encryptionKey = "1234";
  let nav = useNavigate();

  const onchange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const handleCode = async () => {
    const iv = "1234";
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);
    if (emailAddress.length === 0) {
      alert("Email Address is required");
    } else if (!emailAddress.includes("nwmissouri.edu")) {
      alert("Invalid Email");
    } else {
      const encryptedEmail = CryptoJS.AES.encrypt(emailAddress, encryptionKey, {
        iv: ivBytes,
      }).toString();
      const body={
        email:encryptedEmail
      };
      const isValid=await EmailAddressPost(body);
      if(isValid)
      {
        nav("/forgot-password");
      }
      localStorage.setItem("forgotEmail", emailAddress);
      // fetch("http://localhost:5000/forgot-password", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: emailAddress,
      //   }),
      // })
      //   .then((response) => response.json())
      //   .then((text) => {
      //     console.log(text.message + "displaying message"); // Handle the response text
      //     //   alert(text);

      //     if (text.message === "Password reset token generated and sent.") {
      //       nav("/forgot-password");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error); // Handle any errors
      //   });
    }
  };

  return (
    <div className="form-inmiddle">
      <img src={img} alt="Logo" className="imglogo"></img>
      <Form>
        <Form.Group className="mb-3" controlId="forgotpasswordEmail">

          <TextField
            type="email"
            value={emailAddress}
            name="emailAddress"
            placeholder="Email Address"
            onChange={onchange}
            required={true}
          />

          {emailAddress.length > 0 &&
            !emailAddress.includes("nwmissouri.edu") && (
              <span style={{ color: "red", display: "block" }}>
                Please enter @nwmissouri.edu email
              </span>
            )}
        </Form.Group>
        <br />
        <Button type="button" onClick={handleCode} color="primary" label="Send Code"/>
      </Form>
    </div>
  );
};

export default EmailAdress;

import React, { useState } from "react";
import Button from "../../components/Button/Button"
import TextField from "../../components/TextField/Textfield";
import Form from "react-bootstrap/Form";
import furniture from "../../assets/images/B3.png";
import { useNavigate } from "react-router-dom";
import { emailAddressAndCodePost } from "../../utils/api";
import CryptoJS from "crypto-js";

const SendCode = () => {
  const [data, setCode] = useState("");
  var { code } = data;
  const encryptionKey = "1234";
  const onchange = (e) => setCode({ ...data, [e.target.name]: e.target.value });
  let nav = useNavigate();
  // alert(localStorage.getItem("email"));
  //   const { codeentered } = code;

  const handleValidation = async () => {
    const iv = "1234";
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);
    console.log("code",code);
    if (code === undefined || code === "") {
      alert("Enter Code");
    } else {
      const emailAddress=localStorage.getItem("forgotEmail");
      const encryptedEmail = CryptoJS.AES.encrypt(emailAddress, encryptionKey, {
        iv: ivBytes,
      }).toString();
      const encryptedCode = CryptoJS.AES.encrypt(code, encryptionKey, {
        iv: ivBytes,
      }).toString();
      
      //console.log(emailAddress);
      const body={
        email:encryptedEmail,
        code:encryptedCode
      };
      const isValid=await emailAddressAndCodePost(body);
      if(isValid)
      {
        nav("/ResetPassword");
      }
      else{
        alert("Wrong code. Please try again.")
        setCode({ code: "" });

        
      }
      // fetch("http://localhost:5000/check-code", {
      //   method: "POST",

      //   headers: {
      //     "Content-Type": "application/json",
      //   },

      //   body: JSON.stringify({ code: code }),
      // })
      //   .then((response) => response.json())

      //   .then((text) => {
      //     // Handle the response text
      //     alert(text.message);
      //     if (text.message === "Success") {
      //       nav("/ResetPassword");
      //     } else {
      //       nav("/");
      //     }
      //   })

      //   .catch((error) => {
      //     console.error(error); // Handle any errors
      //   });
    }
  };

  return (
    <div className="form-inmiddle">
            <div className="logoDiv">      
      <img src={furniture} alt="Logo" className="logo"></img>
      </div>
      <div className="formDiv">
      <Form>
        <Form.Group className="mb-3" controlId="sendCode">

          <TextField
            type="text"
            name="code"
            value={code}
            label="Please Enter Code"
            placeholder="XXXXXX"
            onChange={onchange}
          />
        </Form.Group>
        <br />
        <Button label="Validate" color="primary" type="button" onClick={handleValidation}/>
      </Form>
      </div>
    </div>
  );
};

export default SendCode;

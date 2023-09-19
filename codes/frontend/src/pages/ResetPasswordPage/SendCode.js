import React, { useState } from "react";
import Button from "../../components/Button/Button"
import TextField from "../../components/TextField/Textfield";
import Form from "react-bootstrap/Form";
import imges from "../../assets/images/mainImage.jpg";
import { useNavigate } from "react-router-dom";
import { emailAddressAndCodePost } from "../../utils/api";

const SendCode = () => {
  const [data, setCode] = useState("");
  const { code } = data;
  const encryptionKey = "1234";
  const onchange = (e) => setCode({ ...data, [e.target.name]: e.target.value });
  let nav = useNavigate();
  // alert(localStorage.getItem("email"));
  //   const { codeentered } = code;

  const handleValidation = async () => {
    const iv = "1234";
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);
    if (code.length === 0) {
      alert("Enter Code");
    } else {
      const emailAddress=localStorage.getItem("email");
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
        nav("/");
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
      <img src={imges} alt="Logo" className="imglogo"></img>
      <Form>
        <Form.Group className="mb-3" controlId="sendCode">

          <TextField
            type="code"
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
  );
};

export default SendCode;

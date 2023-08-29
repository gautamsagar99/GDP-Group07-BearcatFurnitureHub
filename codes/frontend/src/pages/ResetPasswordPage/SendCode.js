import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import imges from "../../assets/images/mainImage.jpg";
import { useNavigate } from "react-router-dom";

const SendCode = () => {
  const [data, setCode] = useState("");
  const { code } = data;
  const onchange = (e) => setCode({ ...data, [e.target.name]: e.target.value });
  let nav = useNavigate();
  // alert(localStorage.getItem("email"));
  //   const { codeentered } = code;

  const handleValidation = async () => {
    if (code.length === 0) {
      alert("Enter Code");
    } else {
      fetch("http://localhost:5000/check-code", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ code: code }),
      })
        .then((response) => response.json())

        .then((text) => {
          // Handle the response text
          alert(text.message);
          if (text.message === "Success") {
            nav("/ResetPassword");
          } else {
            nav("/");
          }
        })

        .catch((error) => {
          console.error(error); // Handle any errors
        });
    }
  };

  return (
    <div className="form-inmiddle">
      <img src={imges} alt="Logo" className="imglogo"></img>
      <Form>
        <Form.Group className="mb-3" controlId="sendCode">
          <Form.Label className="label">
            Please Enter Code <span style={{ color: "red" }}>*</span>
          </Form.Label>

          <Form.Control
            type="code"
            name="code"
            value={code}
            placeholder="XXXXXX"
            onChange={onchange}
            style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}
          />
        </Form.Group>
        <br />
        <Button className="otpbutton" onClick={handleValidation}>
          Validate
        </Button>
      </Form>
    </div>
  );
};

export default SendCode;

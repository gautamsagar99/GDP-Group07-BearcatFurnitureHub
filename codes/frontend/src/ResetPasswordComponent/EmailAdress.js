import React,{useState} from "react";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import img from './image.jpg'
import './ResetPassword.css';

const EmailAdress = () => {
  const [data, setData] = useState({ emailAddress: "" });
  const { emailAddress } = data;
  const onchange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  let nav=useNavigate();
  const handleCode = () => {
    nav("/forgot-password");
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
        <br></br>
        <Button className="otpbutton" onClick={handleCode}>Send Code</Button>
      </Form>
    </div>
  );
};

export default EmailAdress;

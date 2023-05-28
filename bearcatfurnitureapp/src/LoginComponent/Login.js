import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Login.css";
import furniture from './image.jpg';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
      navigate("/signup");
    };
  return (
    <div className="form-center">
      <img src={furniture} className="logo"></img>

      <Form>
        <h1>
          Welcome to <br></br>Bearcat<br></br> Furniture Hub
        </h1>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="label">Email address</Form.Label>
          <br></br>
          <br></br>
          <Form.Control type="email" placeholder="Email Address" style={{ fontSize: "16px", height: "15px", padding: "10px 24px"}} />
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <br></br>
          <br></br>
          <Form.Control type="password" placeholder="Password" style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}/>
        </Form.Group>
        <br></br>
        <Button className="blackbutton">Login</Button>
        <br></br>
        <br></br>
        <Button className="blackbutton" onClick={handleRegister}>SignUp</Button>
        <br></br>
        <br></br>
        <a className="forgotpassword">
          <u>Forgot Password?</u>
        </a>
      </Form>
    </div>
  );
};

export default Login;

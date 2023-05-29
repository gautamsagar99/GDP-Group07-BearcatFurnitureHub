import React,{useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Login.css";
import furniture from './image.jpg';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const[data,setData]=useState({emailAddress:"",password:""})
    const{emailAddress,password}=data;
    const navigate = useNavigate();

    const handleRegister = () => {
      navigate("/signup");
    };

    const onchange=(e)=>setData({...data,[e.target.name]:e.target.value})
  return (
    <div className="form-center">
      <img src={furniture} className="logo"></img>

      <Form>
        <h1>
          Welcome to <br></br>Bearcat<br></br> Furniture Hub
        </h1>
        
        <Form.Group className="mb-3" controlId="formBasicEmail" >
          <Form.Label className="label">Email address</Form.Label>
    
          <Form.Control type="email"  value={emailAddress} name="emailAddress" placeholder="Email Address" onChange={onchange} style={{ fontSize: "16px", height: "15px", padding: "10px 24px"}} />
          {emailAddress.length>0&&!emailAddress.includes("@nwmissouri.edu")&&<span style={{color:"red"}}> Only use nw email</span>}
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="label">Password</Form.Label>
          <Form.Control type="password"  value={password} name="password" placeholder="Password" onChange={onchange} style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}/>
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


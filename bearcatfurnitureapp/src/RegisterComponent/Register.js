import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import image from "./image.jpg";

function Register() {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const { firstname, password, lastname, email } = data;
  const navigate = useNavigate();

  const handleRegister = () => {
    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        first_name: firstname,
        last_name: lastname,
        password: password,
      }),
    })
      .then((response) => response.text())
      .then((text) => {
        console.log(text); // Handle the response text
        alert(text);
        navigate("/");
      })
      .catch((error) => {
        console.error(error); // Handle any errors
      });
    console.log(
      "write logic for sending register details to server using api(http:localhost:8080/signup) with axios module"
    );
  };

  const onchange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div className="form-middle">
      <img src={image} alt="Logo" className="imglogo" />

      <Form>
        <h1 className="heading">Register</h1>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicFirstName">
          <Form.Control
            type="firstname"
            value={firstname}
            name="firstname"
            onChange={onchange}
            placeholder="First Name"
            style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}
          />
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicLastName">
          <Form.Control
            type="lastname"
            value={lastname}
            name="lastname"
            onChange={onchange}
            placeholder="Last Name"
            style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}
          />
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicemail">
          <Form.Control
            type="email"
            value={email}
            name="email"
            onChange={onchange}
            placeholder="Email Address"
            style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}
          />
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicpassword">
          <Form.Control
            type="password"
            value={password}
            name="password"
            onChange={onchange}
            placeholder="Password"
            style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}
          />
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicconfirmpassword">
          <Form.Control
            type="confirmpassword"
            placeholder="Confirm Password"
            style={{ fontSize: "16px", height: "15px", padding: "10px 24px" }}
          />
        </Form.Group>
        <br></br>
        <br></br>
        <Button className="black" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </div>
  );
}

export default Register;

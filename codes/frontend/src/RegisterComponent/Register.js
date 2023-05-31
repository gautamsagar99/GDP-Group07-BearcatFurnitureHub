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
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const { firstname, password, lastname, email, confirmpassword } = data;
  const navigate = useNavigate();

  const handleRegister = () => {


    const isValid = validateForm();

    if (isValid) {
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
    } else {
      console.log("Form validation failed");
    }
  };

  const onchange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (firstname.trim() === "") {
      newErrors.firstname = "First name is required";
      isValid = false;
    } else {
      newErrors.firstname = "";
    }

    if (lastname.trim() === "") {
      newErrors.lastname = "Last name is required";
      isValid = false;
    } else {
      newErrors.lastname = "";
    }



    if (email.trim() === "") {

      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    } else if (!email.match(/^S\d{6}@nwmissouri\.edu$/i)) {
      newErrors.email = "Please enter your university email address";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (password === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    if (confirmpassword === "") {
      newErrors.confirmpassword = "Confirm password is required";
      isValid = false;
    } else if (confirmpassword !== password) {
      newErrors.confirmpassword = "Passwords do not match";
      isValid = false;
    } else {
      newErrors.confirmpassword = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="form-middle">
      <img src={image} alt="Logo" className="imglogo" />

      <Form>
        <h1 className="heading">Register</h1>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicFirstName">
        <Form.Label className="label">First Name<span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="firstname"
            value={firstname}
            name="firstname"
            onChange={onchange}
            placeholder="First Name"
            style={{ fontSize: "16px", height: "15px", padding: "5px 24px" }}
          />
          {errors.firstname && <div className="error">{errors.firstname}</div>}

        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicLastName">
        <Form.Label className="label">Last Name<span style={{ color: 'red' }}>*</span></Form.Label>

          <Form.Control
            type="lastname"
            value={lastname}
            name="lastname"
            onChange={onchange}
            placeholder="Last Name"
            style={{ fontSize: "16px", height: "15px", padding: "5px 24px" }}
          />
          {/* {errors.lastname && <span className="error">{errors.lastname}</span>} */}
          {errors.lastname && <div className="error">{errors.lastname}</div>}

        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicemail">
        <Form.Label className="label">Email<span style={{ color: 'red' }}>*</span></Form.Label>

          <Form.Control
            type="email"
            value={email}
            name="email"
            onChange={onchange}
            placeholder="Email Address"
            style={{ fontSize: "16px", height: "15px", padding: "5px 24px" }}
          />
          {errors.email && <div className="error">{errors.email}</div>}

        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicpassword">
        <Form.Label className="label">Password<span style={{ color: 'red' }}>*</span></Form.Label>

          <Form.Control
            type="password"
            value={password}
            name="password"
            onChange={onchange}
            placeholder="Password"
            style={{ fontSize: "16px", height: "15px", padding: "5px 24px" }}
          />
          {errors.password && <div className="error">{errors.password}</div>}

        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicconfirmpassword">
        <Form.Label className="label">Confirm Password<span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
            type="password"
            value={confirmpassword}
            name="confirmpassword"
            onChange={onchange}
            placeholder="Confirm Password"
            style={{ fontSize: "16px", height: "15px", padding: "5px 24px" }}
          />
          {errors.confirmpassword && <div className="error">{errors.confirmpassword}</div>}

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

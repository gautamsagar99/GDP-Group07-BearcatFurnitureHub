import React, { useState } from "react";
import Button from "../../components/Button/Button"
import TextField from "../../components/TextField/Textfield";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import furniture from "../../assets/images/B3.png";
import { RegisterPost } from "../../utils/api";
import CryptoJS from "crypto-js";

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
  const encryptionKey = "1234";

  const handleRegister = () => {

    const iv = "1234";
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);
    const isValid = validateForm();

    if (isValid) {
      const encryptedEmail = CryptoJS.AES.encrypt(email, encryptionKey, {
        iv: ivBytes,
      }).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey, {
        iv: ivBytes,
      }).toString();
      const body={
            email: encryptedEmail,
            first_name: firstname,
            last_name: lastname,
            password: encryptedPassword,
          }
   if(RegisterPost(body)) 
   {
    navigate("/")
   }
      // fetch("http://localhost:5000/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: email,
      //     first_name: firstname,
      //     last_name: lastname,
      //     password: password,
      //   }),
      // })
      //   .then((response) => response.text())
      //   .then((text) => {
      //     console.log(text); // Handle the response text
      //     alert(text);
      //     navigate("/");
      //   })
      //   .catch((error) => {
      //     console.error(error); // Handle any errors
      //   });
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
    <div className="form-middleR">
           <div className="logoDivR">
        <img src={furniture} alt="Logo" className="logoR"></img>
      </div>

      <div className="formDivR">
      <Form className="rightFormContainerR">
      <h1 className="signUpHeading">Sign Up</h1>
      <div className="formInsiderightFormContainerR">
      <div className="elementNames">
       <Form.Group className="mb-3" controlId="formBasicFirstName">
       <TextField
            type="firstname"
            value={firstname}
            name="firstnameR"
            // label="First Name"
            // required={true}
            onChange={onchange}
            placeholder="First Name"
          />
          {errors.firstname && <div className="error">{errors.firstname}</div>}

        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="formBasicLastName">
  
          <TextField
            type="lastname"
            value={lastname}
            name="lastnameR"
            onChange={onchange}
            placeholder="Last Name"
            // label="Last Name"
            // required={true}
          />
          {/* {errors.lastname && <span className="error">{errors.lastname}</span>} */}
          {errors.lastname && <div className="error">{errors.lastname}</div>}

        </Form.Group>
        <br/>
       </div>
   
        <Form.Group className="mb-3" controlId="formBasicemail">
        

          <TextField
            type="email"
            value={email}
            name="emailR"
            onChange={onchange}
            placeholder="Email Address"
            // label="Email"
            // required={true}
            
          />
          {errors.email && <div className="error">{errors.email}</div>}

        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="formBasicpassword">
        

          <TextField
            type="password"
            value={password}
            name="passwordR"
            onChange={onchange}
            placeholder="Password"
            // label="Password"
            // required={true}
            
          />
          {errors.password && <div className="error">{errors.password}</div>}

        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="formBasicconfirmpassword">
        
        <TextField
            type="password"
            value={confirmpassword}
            name="confirmpasswordR"
            onChange={onchange}
            placeholder="Confirm Password"
            // label="Confirm Password"
            // required={true}
          />
          {errors.confirmpassword && <div className="error">{errors.confirmpassword}</div>}

        </Form.Group>
        <br/>
        <br/>
        <Button type="button" label="Register" onClick={handleRegister} color="primary"/>

      </div>
       
      </Form>
      </div>

    </div>
  );
}

export default Register;

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "../../components/Button/Button"
import TextField from "../../components/TextField/Textfield";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import image from "../../assets/images/mainImage.jpg";
import { emailAddressAndPasswordPost } from "../../utils/api";

function ResetPassword() {
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { email, newPassword, confirmPassword } = data;
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    const isValid = validateForm();
    const body={
      email:email,
      newPassword:newPassword
    };
    
    if (isValid) {
      const validated=await emailAddressAndPasswordPost(body);
      if(validated)
      {
        alert("password updated successfully");
        navigate("/");
      }
      // fetch("http://localhost:5000/update-password", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: email,
      //     newPassword: newPassword,
      //   }),
      // })
      //   .then((response) => response.json())
      //   .then((text) => {
      //     console.log(text.message); // Handle the response text
      //     // alert(text.message);
      //     if (text.message === "Success") {
      //       alert("password updated successfully");
      //       navigate("/");
      //     }
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
    console.log(confirmPassword);
    console.log(newPassword);

    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords doesn't match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="form-middle">
      <img src={image} alt="Logo" className="imglogo" />

      <Form>
        <h1 className="heading">Reset Password</h1>
        <br />
        <Form.Group className="mb-7" controlId="formBasicemail">
          <TextField
            type="email"
            value={email}
            name="email"
            onChange={onchange}
            placeholder="Email Address"
            // disabled="true"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </Form.Group>
        <br />
        <Form.Group className="mb-3" controlId="formBasicpassword">
          <TextField
            type="password"
            value={newPassword}
            name="newPassword"
            onChange={onchange}
            placeholder="New Password"
          />
        </Form.Group>
        <br />
        <Form.Group className="mb-3" controlId="formBasicconfirmpassword">
          <TextField
            type="password"
            value={confirmPassword}
            name="confirmPassword"
            onChange={onchange}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
        </Form.Group>
        <br />
        <br />
        <Button label="Submit" type="button" color="primary" onClick={handleResetPassword}/>
      </Form>
    </div>
  );
}

export default ResetPassword;

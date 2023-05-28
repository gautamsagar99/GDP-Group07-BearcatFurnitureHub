import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import image from './image.jpg';



function Register() {
    const navigate = useNavigate();

    const handleRegister = () => {
      navigate("/");
    };

  return (
    <div className="form-middle">
       <img src={image} alt="Logo" className="imglogo" /> 
        
      <Form>
      
        <h1 className="heading">Register</h1>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicFirstName">
          <Form.Control type="firstname" placeholder="First Name"  style={{ fontSize: "16px", height: "15px", padding: "10px 24px"}}/>
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicLastName">
          <Form.Control type="lastname" placeholder="Last Name"  style={{ fontSize: "16px", height: "15px", padding: "10px 24px"}} />
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicemail">
          <Form.Control type="email" placeholder="Email Address"  style={{ fontSize: "16px", height: "15px", padding: "10px 24px"}}/>
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicpassword">
          <Form.Control type="password" placeholder="Password"  style={{ fontSize: "16px", height: "15px", padding: "10px 24px"}}/>
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formBasicconfirmpassword">
          <Form.Control type="confirmpassword" placeholder="Confirm Password"  style={{ fontSize: "16px", height: "15px", padding: "10px 24px"}}/>
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

import React,{useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import imges from "./image.jpg";
import { useNavigate } from "react-router-dom";

const SendCode = () => {
  const [code, setCode] = useState("");
//   const { codeentered } = code;
  const onchange = (e) => {
    setCode(e.target.value);
  };
  const navigate=useNavigate();
  const handleValidation=()=>
  {
    navigate("/ResetPassword")
  }

  
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
        <br></br>
        <Button className="otpbutton" onClick={handleValidation}>Validate</Button>
      </Form>
    </div>
  );
};

export default SendCode;

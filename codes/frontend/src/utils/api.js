import axios from "axios";

export async function loginPost(userCredentials) {
  try {
    const authenticated=false;
    const response = await axios.post("http://localhost:5000/login", userCredentials, { headers: {
        "Content-Type": "application/json",
      } });

      if(response.data&&response.data.token)
      {
        const jwtToken=response.data.token;
        localStorage.setItem("jwtToken",jwtToken)
      }
      if(response.data === "Login successful")
      {
        authenticated=true;
      }
     return authenticated;
  } 
  catch (error) {
    console.error('Error:', error); 
  }
}
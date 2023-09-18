import axios from "axios";

export async function loginPost(userCredentials) {
  try {
    var authenticated = false;
    const response = await axios.post(
      "http://localhost:5000/login",
      userCredentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.token) {
      const jwtToken = response.data.token;
      localStorage.setItem("jwtToken", jwtToken);
      console.log("jwt token: " + jwtToken);
    }
    if (response.data === "Login successful") {
      authenticated = true;
    }
    return authenticated;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function RegisterPost(userCredentials) {
  try {
    var registered = false;
    const response = await axios.post(
      "http://localhost:5000/signup",
      userCredentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data === "Signup successful") {
      registered = true;
    }
    return registered;
  } catch (error) {
    console.error("Error:", error);
  }
}

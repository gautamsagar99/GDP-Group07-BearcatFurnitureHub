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
    if (response.status === 200) {
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

    if (response.status === 200) {
      registered = true;
    }
    return registered;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function EmailAddressPost(emailId) {
  try {
    var emailValid = false;
    const response = await axios.post(
      "http://localhost:5000/forgot-password",
      emailId,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      emailValid = true;
    }
    return emailValid;
  } catch (error) {
    console.error("Error:", error); // Handle any errors
  }
}

export async function emailAddressAndCodePost(emailIdAndCode) {
  try {
    var isValid = false;
    const response = await axios.post(
      "http://localhost:5000/check-code",
      emailIdAndCode,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      isValid = true;
    }

    return isValid;
  } catch (error) {
    console.error("Error:", error); // Handle any errors
  }
}

export async function emailAddressAndPasswordPost(emailIdAndPassword) {
  try {
    var isValid = false;
    const response = await axios.post(
      "http://localhost:5000/update-password",
      emailIdAndPassword,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      isValid = true;
    }
    return isValid;
  } catch (error) {
    console.error("Error:", error); // Handle any errors
  }
}

export async function UpdateFurniture(requestData) {
  try {
    var isUpdated = false;
    const response = await axios.put(
      `http://localhost:5000/update-furniture`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      isUpdated = true;
    }
    return isUpdated;
  } catch (error) {
    console.error("Error:", error); // Handle any errors
  }
}

export async function getFurnitureForUser() {
  const LoggedInUser = {
    userEmail: localStorage.getItem("LoggedInUser"),
  };
  try {
    const response = await axios.post(
      "http://localhost:5000/get-furniture-for-user",
      LoggedInUser,
      {
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data; // Return the actual data
    }
  } catch (error) {
    console.error("Error:", error); // Handle any errors
    throw error; // Rethrow the error to handle it in your component
  }
}

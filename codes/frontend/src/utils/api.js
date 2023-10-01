import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export async function loginPost(userCredentials) {
  try {
    var authenticated = false;
    const response = await axios.post(apiUrl + "/login", userCredentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data && response.data.token) {
      const jwtToken = response.data.token;
      localStorage.setItem("jwtToken", jwtToken);
      setAuthToken(jwtToken);
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
    const response = await axios.post(apiUrl + "/signup", userCredentials, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwtToken"),
      },
    });

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
    const response = await axios.post(apiUrl + "/forgot-password", emailId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwtToken"),
      },
    });
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
    const response = await axios.post(apiUrl + "/check-code", emailIdAndCode, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwtToken"),
      },
    });
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
      apiUrl + "/update-password",
      emailIdAndPassword,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
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
      apiUrl + "/update-furniture",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
        },
      }
    );
    console.log(response.status + " response from status");
    if (response.status === 200) {
      isUpdated = true;
      return isUpdated;
    }
    return false;
  } catch (error) {
    console.error("Error:", error); // Handle any errors
  }
}

export async function getClosedFurniture() {
  const LoggedInUserEmail = {
    userEmail: localStorage.getItem("LoggedInUser"),
  };
  console.log("userEmail", LoggedInUserEmail);
  try {
    const response = await axios.post(
      apiUrl + "/get-closed-furniture",
      LoggedInUserEmail,
      {
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
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

export async function getAvailableAndRequestedFurniture() {
  const LoggedInUserEmail = {
    userEmail: localStorage.getItem("LoggedInUser"),
  };
  console.log("userEmail", LoggedInUserEmail);
  try {
    const response = await axios.post(
      apiUrl + "/get-available-and-requested-furniture",
      LoggedInUserEmail,
      {
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
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

export async function getMyRequests() {
  const LoggedInUserEmail = {
    userEmail: localStorage.getItem("LoggedInUser"),
  };
  console.log("userEmail", LoggedInUserEmail);
  try {
    const response = await axios.post(
      apiUrl + "/get-requested-furniture-for-user",
      LoggedInUserEmail,
      {
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
        },
      }
    );
    // console.log("response.data",response.data)
    if (response.status === 200) {
      return response.data; // Return the actual data
    }
  } catch (error) {
    console.error("Error:", error); // Handle any errors
    throw error; // Rethrow the error to handle it in your component
  }
}

const setAuthToken = (token) => {
  if (token) {
    console.log("Auth token " + token);
    // Apply the token to every request header
    axios.defaults.headers.Authorization = `${token}`;
  } else {
    // If no token, remove the Authorization header
    delete axios.defaults.headers.Authorization;
  }
};

export default setAuthToken;

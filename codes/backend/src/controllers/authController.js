// src/controllers/authController.js
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { User } = require("../models/user");
const sendResetToken = require("../utils/mailer");
// const CryptoJS = require("crypto-js");

// const key = CryptoJS.enc.Utf8.parse("1234");
// const iv = CryptoJS.enc.Utf8.parse("1234");

var currentCode = 0;

async function login(req, res) {
  const { email, password } = req.body;

  // Decrypt the data
  // const email = CryptoJS.AES.decrypt(encryptedEmail, key, { iv }).toString(
  //   CryptoJS.enc.Utf8
  // );
  // const password = CryptoJS.AES.decrypt(encryptedPassword, key, {
  //   iv,
  // }).toString(CryptoJS.enc.Utf8);

  try {
    // Finding a user with the provided credentials
    const user = await User.findOne({
      where: {
        email,
        password,
      },
    });

    if (user) {
      // If a matching user is found, send login success message
      console.log(`Login successful with email ID - ${email}`);
      res.send("Login successful");
    } else {
      // If no matching user is found, send login failed message
      console.log("Login failed ");
      res.send("Invalid Email ID/Password ");
    }
  } catch (err) {
    console.error("Error finding user:");
    res.status(500).send("Internal Server Error");
  }
}

async function signup(req, res) {
  const { email, password, first_name, last_name } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      // If a user with the same email already exists, send a response indicating the email is taken
      console.log(`Email ${email} is already taken`);
      return res.send("Email is already taken");
    }

    // Create a new user
    const newUser = await User.create({
      email,
      password,
      first_name,
      last_name,
    });

    // If the user is successfully created, send a success response
    console.log(`Signup successful for email ${email}`);
    res.send("Signup successful");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function forgotPassword(req, res) {
  // Generate a unique token or code
  // const resetToken = uuidv4();

  // TODO: Save the reset token and associate it with the user (e.g., in a database)

  const uuid = uuidv4();
  const numericPart = uuid.replace(/\D/g, ""); // Extract only the numeric characters from the UUID
  const fourDigitNumber = numericPart.slice(0, 6); // Take the first four digits
  console.log(req.body.email);
  // Send the reset token to the user's email
  sendResetToken(req.body.email, fourDigitNumber);
  console.log("The reset token after generating " + fourDigitNumber);
  currentCode = fourDigitNumber;
  // Return a response to the client
  res.status(200).json({ message: "Password reset token generated and sent." });
}

async function checkCode(req, res) {
  // console.log(currentCode + "server code");
  // console.log(req.body.code + "from frontend to backend code");
  // console.log(typeof currentCode + "server code");
  // console.log(typeof req.body.code + "from frontend to backend code");
  if (Number.parseInt(req.body.code) == currentCode) {
    console.log("both codes are equal");
    res.status(200).json({ message: "Success" });
  } else {
    return res.status(404).json({ message: "Failed" });
  }
  // Return a response to the client
}

async function updatePassword(req, res) {
  const { email, newPassword } = req.body;

  console.log("password is changing with " + email + " " + newPassword);
  // Find the user based on the email
  const user = User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Save the updated user to the database or any other storage mechanism
  const updatedUser = await User.update(
    { password: newPassword },
    { where: { email } }
  );

  if (updatedUser[0] === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "Success" });
}

async function test(req, res) {
  res.send("testing server api");
}

module.exports = {
  login,
  signup,
  forgotPassword,
  checkCode,
  updatePassword,
  test,
};

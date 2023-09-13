// src/controllers/authController.js
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { Op } = require("sequelize"); // Import Op from Sequelize
const { User } = require("../models/user");
const sendResetToken = require("../utils/mailer");
const ResetCode = require("../models/resetCode");
const { decryptData } = require("../utils/cryptoUtils");
const jwt = require("jsonwebtoken");

var currentEmail = "";

async function login(req, res) {
  const { encryptedEmail, encryptedPassword } = req.body;

  // console.log(encryptedEmail);
  // console.log(encryptedPassword);

  // Decrypt the email and password
  const email = decryptData(encryptedEmail);
  const password = decryptData(encryptedPassword);

  // console.log(email);
  //   console.log(password);

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
      // res.send("Login successful");

      const token = jwt.sign({ email: email }, "1234", {
        expiresIn: "1h", // Set the token expiration time (e.g., 1 hour)
      });
      console.log(token);
      // Send the token as a response
      res.status(200).json({ token });
    } else {
      // If no matching user is found, send login failed message
      console.log("Login failed ");
      res.send("Invalid Email ID/Password ");

      // // If no matching user is found, send an error response
      // console.log("Login failed ");
      // res.status(401).json({ message: "Invalid Email ID/Password" });
    }
  } catch (err) {
    console.error("Error finding user:");
    res.status(500).send("Internal Server Error");
  }
}

async function signup(req, res) {
  const { email, password, first_name, last_name } = req.body;

  // Decrypt the data
  // const email = CryptoJS.AES.decrypt(encryptedEmail, key, { iv }).toString(
  //   CryptoJS.enc.Utf8
  // );
  // const password = CryptoJS.AES.decrypt(encryptedPassword, key, {
  //   iv,
  // }).toString(CryptoJS.enc.Utf8);

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
  currentEmail = req.body.email;
  // Calculate expiration time (1 day from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  try {
    // Store the reset code in the database
    await ResetCode.create({
      email: req.body.email,
      code: fourDigitNumber,
      expiresAt,
    });

    // Send the reset token to the user's email
    sendResetToken(req.body.email, fourDigitNumber);

    // sendResetToken(req.body.email, fourDigitNumber);
    console.log("The reset token after generating " + fourDigitNumber);
    // currentCode = fourDigitNumber;
    // Return a response to the client
    res
      .status(200)
      .json({ message: "Password reset token generated and sent." });
  } catch (err) {
    console.error("Error generating reset token:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function checkCode(req, res) {
  // console.log(currentCode + "server code");
  // console.log(req.body.code + "from frontend to backend code");
  // console.log(typeof currentCode + "server code");
  // console.log(typeof req.body.code + "from frontend to backend code");
  // if (Number.parseInt(req.body.code) == currentCode) {
  //   console.log("both codes are equal");
  //   res.status(200).json({ message: "Success" });
  // } else {
  //   return res.status(404).json({ message: "Failed" });
  // }
  // Return a response to the client

  try {
    // Find the reset code
    const resetCodeRecord = await ResetCode.findOne({
      where: {
        email: currentEmail,
        code: req.body.code,
        expiresAt: {
          [Op.gt]: new Date(), // Check if expiration time is greater than now
        },
      },
    });

    if (resetCodeRecord) {
      // Code is valid
      res.status(200).json({ message: "Code is valid." });
    } else {
      // Code is invalid or expired
      res.status(400).json({ message: "Invalid code or code has expired." });
    }
  } catch (err) {
    console.error("Error checking code:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function updatePassword(req, res) {
  const { email, newPassword } = req.body;

  console.log("password is changing with " + email + " " + newPassword);

  try {
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

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).send("Internal Server Error");
  }
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
//authController.js

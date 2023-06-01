// Importing required modules
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const environmentVariables = require("dotenv").config();

var currentCode = 0;
// Create a transporter
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // Set to true if using port 465 (SSL/TLS)
  auth: {
    user: "gautamsagar72@gmail.com", // Your Outlook email address
    pass: process.env.EMAIL_PASSWORD, // Your Outlook email password or app password
  },
});

function sendResetToken(email, resetToken) {
  // Configure the email options
  const mailOptions = {
    from: "gautamsagar72@gmail.com", // Sender email address
    // to: "s555619@nwmissouri.edu", // Recipient email address
    to: email,
    subject: "Password Reset", // Email subject
    text: `Your password reset token: ${resetToken}`, // Email content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Creating an instance of Express
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Creating a Sequelize instance and establishing a connection
const sequelize = new Sequelize("bearcathub", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Defining a User model
const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

// Syncing the model with the database
// Updating the above schema into database
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

// Route handler for the '/login' route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
});

// Route handler for the '/signup' route
app.post("/signup", async (req, res) => {
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
});

app.post("/forgot-password", (req, res) => {
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
});

app.post("/check-code", (req, res) => {
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
});

app.post("/update-password", async (req, res) => {
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
});

app.get("/test", async (req, res) => {
  res.send("testing server api");
});

// Starting the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});

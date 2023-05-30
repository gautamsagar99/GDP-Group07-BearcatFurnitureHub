// Importing required modules
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");



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
      res.send("Login failed");
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

app.get("/test", async (req, res) => {
  res.send("testing server api");
});

// Starting the server
app.listen(5000, () => {
  console.log("Server started on port 3000");
});

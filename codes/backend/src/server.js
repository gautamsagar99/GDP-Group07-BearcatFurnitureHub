// src/server.js
const dotenv = require("dotenv");
const path = require("path");
// Specify the path to your .env file
const envPath = path.join("__dirname", "../.env");

// Load the environment variables from the specified .env file
dotenv.config({ path: envPath });

const express = require("express");
const cors = require("cors");
const { Op, Sequelize } = require("sequelize"); // Import Op from Sequelize
const sequelize = require("./config/database");
const { Furniture } = require("./models/furniture"); // Import the Furniture model
const { Requested } = require("./models/requested");
const authRoutes = require("./routes/authRoutes");
const furnitureRoutes = require("./routes/furnitureRoutes");
const cron = require("node-cron");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(authRoutes);
app.use(furnitureRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).send("Internal Server Error");
});

// Schedule a daily job to clean up expired codes
cron.schedule("0 0 * * *", async () => {
  const ResetCode = require("./models/resetCode"); // Import here to avoid circular dependencies
  await ResetCode.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date(), // Delete codes where expiration time is less than now
      },
    },
  });
  console.log("Expired reset codes cleaned up.");
});

// Define the associations between models if needed
// For example, if Furniture and Requested have associations:
Furniture.hasMany(Requested, { foreignKey: "furniture_id" });
Requested.belongsTo(Furniture, { foreignKey: "furniture_id" });

const PORT = process.env.PORT || 5000;
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
    app.listen(PORT, async () => {
      // console.log(process.env.ENCRYPTION_KEY);
      // console.log(process.env.ENCRYPTION_IV);
      console.log(`Server started on port ${PORT}`);

      if (process.env.ENVIRONMENT == "production") {
        // Define your SQL statements
        const sqlStatements = [
          "INSERT INTO users (id, email, password, first_name, last_name) VALUES (1, 's555620@nwmissouri.edu', 'root', 'Mamatha', 'Mallela');",
          "INSERT INTO users (id, email, password, first_name, last_name) VALUES (2, 's555619@nwmissouri.edu', 'root', 'Gautam', 'Mallela');",
        ];

        // Execute SQL statements using Sequelize's query method
        for (const sqlStatement of sqlStatements) {
          await sequelize.query(sqlStatement, {
            type: Sequelize.QueryTypes.INSERT,
          });
        }

        console.log("executed scripts");
      }
    });
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });
//server.js

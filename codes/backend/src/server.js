// src/server.js
const dotenv = require("dotenv");
const path = require("path");
// Specify the path to your .env file
const envPath = path.join(
  "C:/Users/S555620/Documents/Third Sem/GDP-1/ProjectCode/GDP-Group07-BearcatFurnitureHub/codes/backend/",
  ".env"
);

// Load the environment variables from the specified .env file
dotenv.config({ path: envPath });

const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize"); // Import Op from Sequelize
const sequelize = require("./config/database");
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

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    // console.log(process.env.ENCRYPTION_KEY);
    // console.log(process.env.ENCRYPTION_IV);
    console.log(`Server started on port ${PORT}`);
  });
});
//server.js

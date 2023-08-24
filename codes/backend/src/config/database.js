// src/config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bearcathub", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});



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

  
module.exports = sequelize;

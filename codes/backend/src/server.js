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
          "INSERT INTO bearcathub.furniture(id,name,furniture_condition,years_used,image_url,furniture_type,furniture_description,Donated_date,user_id,status) VALUES (101,'Classic Wooden Chair','Good',1,'https://images.pexels.com/photos/3705539/pexels-photo-3705539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1','Chair','This is a classic wooden corner chair with good condition. Its sturdy wooden frame exhibits a rich, lustrous finish, with no noticeable scratches or dents. The plush seat and backrest cushions remain firm and comfortable, showing no sagging or deformation.','2023-10-09 00:00:00',1,'available');",
          "INSERT INTO bearcathub.furniture(id,name,furniture_condition,years_used,image_url,furniture_type,furniture_description,Donated_date,user_id,status) VALUES (102,'Outdoor Wooden Table','Excellent',1,'https://images.pexels.com/photos/14656123/pexels-photo-14656123.jpeg?auto=compress&cs=tinysrgb&w=600','Table','This Outdoor Wooden Table with Chairs is in excellent condition. The edges are smooth, with no chipping or dents, ensuring a professional and neat appearance. All adjustable components, such as the height and drawer mechanisms, work smoothly and without any hitches.','2023-11-09 00:00:00',2,'available');",
          "INSERT INTO bearcathub.furniture(id,name,furniture_condition,years_used,image_url,furniture_type,furniture_description,Donated_date,user_id,status) VALUES (103,'Modern Lounge Chair','Excellent',1,'https://images.pexels.com/photos/6198655/pexels-photo-6198655.jpeg?auto=compress&cs=tinysrgb&w=600','Chair','This Modern Leather Lounge Chair is in excellent condition. Its sturdy wooden frame exhibits a rich, lustrous finish, with no noticeable scratches or dents.','2023-02-09 00:00:00',1,'available');",
          "INSERT INTO bearcathub.furniture(id,name,furniture_condition,years_used,image_url,furniture_type,furniture_description,Donated_date,user_id,status) VALUES (104,'L Shaped Modular Sofa','Good',2,'https://media.istockphoto.com/id/1400158791/photo/living-room.jpg?b=1&s=612x612&w=0&k=20&c=vw2gE5tifx5IohnXSMlg6VFerY3I20kzUN6j7mzKvs4=','Sofa','This L Shaped Modular Sofa Set is in good condition, showing minimal signs of wear and tear. Its upholstery, a rich velvet fabric remains free from any noticeable stains, tears, or fading. The cushions are still firm and comfortable, providing ample support.','2023-10-09 00:00:00',1,'available');",
          "INSERT INTO bearcathub.furniture(id,name,furniture_condition,years_used,image_url,furniture_type,furniture_description,Donated_date,user_id,status) VALUES (105,'Three Seater Sofa','Excellent',2,'https://images.pexels.com/photos/4857775/pexels-photo-4857775.jpeg?auto=compress&cs=tinysrgb&w=600','Sofa','This three Seater Sofa is in excellent condition. The wooden frame and legs are sturdy and intact, with no visible scratches or chips. Overall, this sofa appears almost brand new, well-cared-for, and ready to provide years of comfort and style to any living space.','2023-04-09 00:00:00',1,'available');",
          "INSERT INTO bearcathub.furniture(id,name,furniture_condition,years_used,image_url,furniture_type,furniture_description,Donated_date,user_id,status) VALUES (106,'White Computer Desk','Good',1,'https://images.pexels.com/photos/5998739/pexels-photo-5998739.jpeg?auto=compress&cs=tinysrgb&w=600','Table','This White Computer or Laptop Desk is in good condition. Its sleek, polished wooden surface remains free from scratches, stains, or blemishes. The edges are smooth, with no chipping or dents, ensuring a professional and neat appearance. The metal legs and framework are sturdy and rust-free, providing stability and durability.','2023-10-09 00:00:00',1,'available');",

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

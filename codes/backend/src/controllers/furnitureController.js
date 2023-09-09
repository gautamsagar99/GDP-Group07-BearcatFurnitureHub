// controllers/furnitureController.js
const { Furniture } = require("../models/furniture"); // Import your Furniture model

// Function to create a new furniture record
async function createFurniture(req, res) {
  try {
    const { name, condition, yearsUsed, imageUrl, category } = req.body;

    // Create a new furniture record in the database
    const furniture = await Furniture.create({
      name,
      condition,
      yearsUsed,
      imageUrl,
      category,
    });

    res
      .status(201)
      .json({ message: "Furniture created successfully", furniture });
  } catch (error) {
    console.error("Error creating furniture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllFurniture(req, res) {
  try {
    // Retrieve all furniture records from the database
    const furnitureList = await Furniture.findAll();

    res.status(200).json(furnitureList);
  } catch (error) {
    console.error("Error retrieving furniture:", error);

    // Send a more informative error response
    res
      .status(500)
      .json({ message: "Error retrieving furniture", error: error.message });
  }
}

// Add more controller functions for updating and deleting furniture records as needed

module.exports = {
  createFurniture,
  getAllFurniture,
  // Add other functions here
};

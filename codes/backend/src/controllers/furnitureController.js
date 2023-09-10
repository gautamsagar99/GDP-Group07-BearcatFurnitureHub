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

// Function to get one furniture record by ID
async function getFurnitureById(req, res) {
  try {
    const { id } = req.params; // Get the ID from the request parameters

    // Find the furniture record by ID in the database
    const furniture = await Furniture.findByPk(id);

    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    res.status(200).json(furniture);
  } catch (error) {
    console.error("Error retrieving furniture by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to update a specific furniture record by ID
async function updateFurniture(req, res) {
  try {
    const { id } = req.params;
    const { name, condition, yearsUsed, imageUrl, category } = req.body;

    // Retrieve the furniture record by ID from the database
    const furniture = await Furniture.findByPk(id);

    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    // Update the furniture record
    furniture.name = name;
    furniture.condition = condition;
    furniture.yearsUsed = yearsUsed;
    furniture.imageUrl = imageUrl;
    furniture.category = category;

    // Save the updated furniture record to the database
    await furniture.save();

    res
      .status(200)
      .json({ message: "Furniture updated successfully", furniture });
  } catch (error) {
    console.error("Error updating furniture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to delete a specific furniture record by ID
async function deleteFurniture(req, res) {
  try {
    const { id } = req.params;

    // Retrieve the furniture record by ID from the database
    const furniture = await Furniture.findByPk(id);

    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    // Delete the furniture record
    await furniture.destroy();

    res.status(200).json({ message: "Furniture deleted successfully" });
  } catch (error) {
    console.error("Error deleting furniture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add more controller functions for updating and deleting furniture records as needed

module.exports = {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
  // Add other functions here
};

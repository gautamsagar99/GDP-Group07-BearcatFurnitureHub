// routes/furnitureRoutes.js
const express = require("express");
const furnitureController = require("../controllers/furnitureController");

const router = express.Router();

// Define routes for furniture-related functionality
router.post("/create-furniture", furnitureController.createFurniture);
router.get("/get-furniture", furnitureController.getAllFurniture);
router.get("/get-furniture/:id", furnitureController.getFurnitureById);
router.put("/update-furniture/:id", furnitureController.updateFurniture); // Update furniture by ID
router.delete("/delete-furniture/:id", furnitureController.deleteFurniture);
// Add more routes for updating and deleting furniture records as needed

module.exports = router;

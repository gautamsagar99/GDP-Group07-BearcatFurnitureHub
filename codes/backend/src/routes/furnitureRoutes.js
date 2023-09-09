// routes/furnitureRoutes.js
const express = require("express");
const furnitureController = require("../controllers/furnitureController");

const router = express.Router();

// Define routes for furniture-related functionality
router.post("/create-furniture", furnitureController.createFurniture);
router.get("/get-furniture", furnitureController.getAllFurniture);
// Add more routes for updating and deleting furniture records as needed

module.exports = router;

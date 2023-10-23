// routes/furnitureRoutes.js
const express = require("express");
const furnitureController = require("../controllers/furnitureController");
const multer = require("multer");

// Configure multer to specify where to store uploaded files
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// Define routes for furniture-related functionality
router.post(
  "/create-furniture",
  upload.single("image"),
  furnitureController.createFurniture
);
router.get(
  "/get-all-furniture/:userEmail",
  furnitureController.getAllFurniture
);
router.get("/get-furniture/:id", furnitureController.getFurnitureById);
router.put("/update-furniture", furnitureController.updateFurniture); // Update furniture by ID
router.post(
  "/edit-furniture",
  upload.single("image"),
  furnitureController.editFurniture
);
router.delete("/delete-furniture/:id", furnitureController.deleteFurniture);
// Add more routes for updating and deleting furniture records as needed

router.post("/get-closed-furniture", furnitureController.getClosedFurniture);
router.post(
  "/get-available-and-requested-furniture",
  furnitureController.getAvailableAndRequestedFurniture
);
router.post(
  "/get-requested-furniture-for-user",
  furnitureController.getRequestedFurnitureForUser
);
router.post("/get-furniture-for-user", furnitureController.getFurnitureForUser);
router.post("/search-furniture", furnitureController.searchFurniture);
router.post("/get-user-details", furnitureController.getUserDetails);
router.post(
  "/get-donated-requested-user",
  furnitureController.getDonatedAndRequestedUser
);

module.exports = router;

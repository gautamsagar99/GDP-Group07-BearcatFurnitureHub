// src/routes/authRoutes.js
const express = require("express");
const {
  login,
  signup,
  forgotPassword,
  checkCode,
  updatePassword,
  test,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgotPassword);
router.post("/check-code", checkCode);
router.post("/update-password", updatePassword);
router.post("/test", test);

module.exports = router;

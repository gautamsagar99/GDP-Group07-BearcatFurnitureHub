// src/routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");

// Define your middleware for token verification
function verifyToken(req, res, next) {
  // console.log("verified");
  // next();
  // if (
  //   req.originalUrl === "/login" ||
  //   req.originalUrl === "/signup" ||
  //   req.originalUrl === "/register" ||
  //   req.originalUrl === "/create-furniture" ||
  //   req.originalUrl === "/get-furniture" ||
  //   req.originalUrl === "/forgot-password" ||
  //   req.originalUrl === "/check-code" ||
  //   req.originalUrl === "/update-password" ||
  //   req.originalUrl === "/test"
  // ) {
  //   return next(); // Skip token verification for these routes
  // }

  // const token = req.headers.authorization; // Get the token from the request headers

  // if (!token) {
  //   return res.status(401).json({ message: "Authorization token is missing" });
  // }

  try {
    // Verify the token
    // const decoded = jwt.verify(token, "1234"); // Use the same secret key you used to sign the token

    // // Attach the decoded user information to the request for later use
    // req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

const {
  login,
  signup,
  forgotPassword,
  checkCode,
  updatePassword,
  test,
} = require("../controllers/authController");

const router = express.Router();

// Apply the verifyToken middleware to all routes
router.use(verifyToken);

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgotPassword);
router.post("/check-code", checkCode);
router.post("/update-password", updatePassword);
router.post("/test", test);

module.exports = router;

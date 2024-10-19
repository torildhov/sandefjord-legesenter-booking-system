import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

//Authetication middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  // Extract the token from the cookies
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user from the payload to the request object
    req.user = decoded;

    // Move to the next middleware
    next();
  } catch (error) {
    // Handle invalid token
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
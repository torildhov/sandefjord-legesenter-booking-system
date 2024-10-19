import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Authentication middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

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

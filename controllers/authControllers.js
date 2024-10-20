import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

//REGISTER A NEW USER
export const registerUser = async (req, res) => {
  let { user_name, email, password } = req.body;

  // Validate input presence
  if (!user_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate username (letters and spaces only)
  const usernameRegex = /^[A-Åa-å\s]+$/;
  if (!usernameRegex.test(user_name)) {
    return res
      .status(400)
      .json({ message: "Your name must contain letters and spaces only." });
  }

  // Validate password length
  if (!validator.isLength(password, { min: 8 })) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    // Sanitize inputs
    user_name = validator.escape(user_name);

    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.query(
      "INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)",
      [user_name, email, hashedPassword]
    );

    // Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occured while registering the user" });
  }
};

// LOGIN A USER
export const loginUser = async (req, res) => {
  // Extract email and password from the request body
  let { email, password } = req.body;

  // Validate input presence - email and password are required
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format - must be a valid email address
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Query the database to find a user with the provided email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // If no user is found, return an authentication error
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Get the first (and should be only) user from the result
    const user = users[0];

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an authentication error
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the token in the response body
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    // Catch any errors that occur during the login process
    console.error("Login error:", error);
    res.status(500).json({
      message: "An error occurred while logging in",
    });
  }
};

// LOGOUT A USER
export const logoutUser = (req, res) => {
  try {
    // Clear the token by sending an empty response
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "An error occurred while logging out." });
  }
};

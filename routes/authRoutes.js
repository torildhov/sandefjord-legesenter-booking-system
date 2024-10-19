import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authControllers.js";

const router = express.Router();

//Routes for user registration, login, and logout
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;
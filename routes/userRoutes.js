import express from "express";
import {
  availableAppointments,
  bookAppointment,
  changeAppointment,
  deleteAppointment,
} from "../controllers/userControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Routes for users to get available appointments, book appointments, change appointments, and delete appointments
router.route("/appointments").get(authMiddleware, availableAppointments);
router.route("/appointments").post(authMiddleware, bookAppointment);
router.route("/appointments/:appointmentId").put(authMiddleware, changeAppointment);
router.route("/appointments/:appointmentId").delete(authMiddleware, deleteAppointment);

export default router;
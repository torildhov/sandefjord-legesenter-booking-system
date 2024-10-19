import express from 'express';
import { getDoctors, addDoctor, updateDoctor, deleteDoctor, getBookedAppointments } from '../controllers/adminControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

//Routes for admin to get a list of doctors, add a doctor, update a doctor, delete a doctor, and get booked appointments
router.get('/doctors', authMiddleware, adminMiddleware, getDoctors);
router.post('/doctors', authMiddleware, adminMiddleware, addDoctor);
router.put('/doctors/:doctorId', authMiddleware, adminMiddleware, updateDoctor);
router.delete('/doctors/:doctorId', authMiddleware, adminMiddleware, deleteDoctor);
router.get('/appointments', authMiddleware, adminMiddleware, getBookedAppointments);

export default router;

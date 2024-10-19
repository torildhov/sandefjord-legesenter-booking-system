import express from "express";
import db from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());

//App routes
app.use('/api/', authRoutes);
app.use('/api/', userRoutes);
app.use('/api/admin', adminRoutes);

//Server configuration and startup
const url = process.env.URL || "http://localhost";
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at ${url}:${port}`);
});
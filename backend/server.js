import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import attendancRouter from './routes/attendanceRoutes.js';
import cookieParser from 'cookie-parser'; 


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendancRouter);
app.use("/api/user",userRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import { getAllCheckins, getAllEmployees, getSingleCheckin, getTodayCheckouts, getUserCheckinHistory } from "../controllers/adminController.js";
import isAuth from "../middleware/isAuth.js";

const adminRouter = express.Router();

// 🔒 Protected routes
adminRouter.get("/checkins", isAuth, getAllCheckins);
adminRouter.get("/employees", isAuth, getAllEmployees);
adminRouter.get("/history/:userId", isAuth, getUserCheckinHistory);
adminRouter.get("/checkin/:checkinId", isAuth, getSingleCheckin);
adminRouter.get("/checkouts/today", getTodayCheckouts);


export default adminRouter;

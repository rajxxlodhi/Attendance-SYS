import express from "express";
import isAuth from "../middleware/isAuth.js";
import {  checkOut, createCheckin, getActive, getCheckinHistory } from "../controllers/checkinController.js";

const checkinRouter = express.Router();

checkinRouter.post("/checkin", isAuth, createCheckin );
checkinRouter.get("/active", isAuth, getActive );
checkinRouter.post("/checkout", isAuth, checkOut );
checkinRouter.get("/history", isAuth, getCheckinHistory);





export default checkinRouter;

import express from "express";
import isAuth from "../middleware/isAuth.js";
import {   checkout, createCheckin, getActive, getCheckinHistory } from "../controllers/checkinController.js";
import upload from "../middleware/multer.js";

const checkinRouter = express.Router();

checkinRouter.post("/checkin", isAuth, createCheckin );
checkinRouter.get("/active", isAuth, getActive );
checkinRouter.post("/checkout", isAuth, checkout );
checkinRouter.get("/history", isAuth, getCheckinHistory);





export default checkinRouter;

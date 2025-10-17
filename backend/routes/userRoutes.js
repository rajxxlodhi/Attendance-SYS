import express from "express";
import { getCurrentUser } from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";

const userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);



export default userRouter;

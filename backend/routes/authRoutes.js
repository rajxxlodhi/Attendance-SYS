import express from "express";
import { registerEmployee, loginEmployee, LogOutEmployee } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/logout",LogOutEmployee);


export default router;

import express from "express";
import { registerEmployee, loginEmployee, LoguotEmployee } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/logout",LoguotEmployee);


export default router;

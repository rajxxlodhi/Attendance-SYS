import express from "express";

const router = express.Router();

// Example route (you can replace this later)
router.get("/", (req, res) => {
  res.send("Attendance API working...");
});

export default router;

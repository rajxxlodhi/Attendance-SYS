import express from "express";

const attendancRouter = express.Router();

// Example route (you can replace this later)
attendancRouter.get("/", (req, res) => {
  res.send("Attendance API working...");
});

export default attendancRouter;

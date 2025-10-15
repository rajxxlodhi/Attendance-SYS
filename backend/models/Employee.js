import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // role: { type: String, enum: ["employee", "admin"], default: "employee" },
  // createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Employee", employeeSchema);

import Employee from "../models/Employee.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await Employee.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

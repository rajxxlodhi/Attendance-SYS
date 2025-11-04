import CheckIn from "../models/CheckinModel.js";
import Employee from "../models/Employee.js";


// ✅ Get all check-in details (for admin dashboard)
export const getAllCheckins = async (req, res) => {
  try {
    // verify user
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const adminUser = await Employee.findById(req.userId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // FETCH ONLY ACTIVE CHECK-INS:
    // Active = not checked out AND not auto-finished
    const checkins = await CheckIn.find({
      checkOutTime: null,
      autoFinished: false
    })
      .populate("user", "name email role")
      .sort({ checkInTime: -1 });

    return res.status(200).json(checkins);
  } catch (error) {
    console.error("getAllCheckins error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    // ✅ Get only employees (exclude admins)
    const employees = await Employee.find({ role: "employee" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    // ✅ For each employee, check their latest check-in record
    const employeesWithStatus = await Promise.all(
      employees.map(async (emp) => {
        const latestCheckin = await CheckIn.findOne({ user: emp._id })
          .sort({ checkInTime: -1 })
          .select("status"); // only fetch status

        return {
          ...emp.toObject(),
          checkinStatus: latestCheckin?.status || "inactive", // fallback
        };
      })
    );

    res.status(200).json(employeesWithStatus);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: error.message });
  }
};




// ✅ Get history of a specific employee
export const getUserCheckinHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify admin
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminUser = await Employee.findById(req.userId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Fetch all checkins for that user
    const history = await CheckIn.find({ user: userId })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No check-in history found for this user." });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching user check-in history:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get a single check-in detail
export const getSingleCheckin = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const checkin = await CheckIn.findById(checkinId).populate("user", "name email role");
    if (!checkin) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    res.status(200).json(checkin);
  } catch (error) {
    console.error("Error fetching check-in:", error);
    res.status(500).json({ message: error.message });
  }
};



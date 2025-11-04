import uploadOnCloudinary from "../config/cloudinary.js";
import CheckIn from "../models/CheckinModel.js";
import Employee from "../models/Employee.js";
import { io } from "../socket/socket.js";

const EXPIRE_MS = 14 * 60 * 60 * 1000; // 14 hours

// Auto-finish old check-ins & emit real-time updates
async function autoFinishOld(userId) {
  const activeCheckins = await CheckIn.find({
    user: userId,
    checkOutTime: null,
    autoFinished: false,
    status: "active",
  });

  for (const checkin of activeCheckins) {
    const elapsed = Date.now() - new Date(checkin.checkInTime).getTime();
    if (elapsed >= EXPIRE_MS) {
      checkin.checkOutTime = new Date(new Date(checkin.checkInTime).getTime() + EXPIRE_MS);
      checkin.autoFinished = true;
      checkin.status = "auto-finished";
      await checkin.save();

      // Emit event so Admin dashboard updates in real-time
      try {
        io.emit("autoFinishCheckin", {
          userId,
          checkInId: checkin._id,
          status: checkin.status,
        });
      } catch (err) {
        console.error("Socket emit error in autoFinishOld:", err);
      }
    }
  }
}

export const createCheckin = async (req, res) => {
  try {
    const userId = req.userId;

    // Auto-close any old check-ins before creating a new one
    await autoFinishOld(userId);

    // Ensure no existing active check-in
    const existing = await CheckIn.findOne({
      user: userId,
      checkOutTime: null,
      autoFinished: false,
      status: "active",
    }).lean();

    if (existing) {
      return res.status(400).json({ message: "Already checked in." });
    }

    const { image, location } = req.body;

    let imageUrl = "";
    if (typeof image === "string" && image.startsWith("data:image")) {
      imageUrl = await uploadOnCloudinary(image);
    } else if (typeof image === "string") {
      imageUrl = image;
    }

    const newCheckin = await CheckIn.create({
      user: userId,
      image: imageUrl,
      location: location || null,
      checkInTime: new Date(),
      checkOutTime: null,
      autoFinished: false,
      status: "active",
    });

    await Employee.findByIdAndUpdate(userId, {
      $push: { checkins: newCheckin._id },
    });

    const populated = await CheckIn.findById(newCheckin._id).populate("user", "name email").lean();

    // Emit new check-in event to all admins
    io.emit("newCheckin", populated);

    return res.status(201).json(populated);
  } catch (error) {
    console.error("createCheckin error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getActive = async (req, res) => {
  try {
    const userId = req.userId;
    await autoFinishOld(userId);

    const active = await CheckIn.findOne({
      user: userId,
      checkOutTime: null,
      autoFinished: false,
      status: "active",
    })
      .sort({ checkInTime: -1 })
      .lean();

    return res.status(200).json(active || null);
  } catch (error) {
    console.error("getActive error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const checkout = async (req, res) => {
  try {
    const userId = req.userId;

    const active = await CheckIn.findOne({
      user: userId,
      status: "active",
      checkOutTime: null,
    });

    if (!active) {
      return res.status(400).json({ message: "No active check-in found." });
    }

    active.checkOutTime = new Date();
    active.status = "checked-out";
    await active.save();

    // Notify admin dashboard instantly
    io.emit("employeeCheckedOut", {
      userId,
      checkInId: active._id,
    });

    return res.status(200).json({
      message: "Checked out successfully",
      data: active,
    });
  } catch (error) {
    console.error("checkout error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const forceCheckoutById = async (req, res) => {
  try {
    const { id } = req.params;
    const checkin = await CheckIn.findById(id);

    if (!checkin) return res.status(404).json({ message: "Check-in not found" });
    if (checkin.checkOutTime) return res.status(400).json({ message: "Already checked out" });

    checkin.checkOutTime = new Date();
    checkin.status = "checked-out";
    checkin.autoFinished = false;
    await checkin.save();

    io.emit("employeeCheckedOut", { checkInId: checkin._id });

    return res.status(200).json({ message: "Forced checkout successful", data: checkin });
  } catch (error) {
    console.error("forceCheckoutById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCheckinHistory = async (req, res) => {
  try {
    const userId = req.userId;

    await autoFinishOld(userId);

    const employee = await Employee.findById(userId).select("name email").lean();
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const history = await CheckIn.find({ user: userId }).sort({ checkInTime: -1 }).lean();

    const result = history.map((h) => ({
      _id: h._id,
      name: employee.name,
      email: employee.email,
      checkInTime: h.checkInTime,
      checkOutTime: h.checkOutTime,
      status: h.status,
      location: h.location,
      image: h.image,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("getCheckinHistory error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin helper: get all checkins (for /api/admin/checkins)
export const getAllCheckinsForAdmin = async (req, res) => {
  try {
    // optionally verify admin role here if your isAuth doesn't include role check
    const all = await CheckIn.find({})
      .sort({ checkInTime: -1 })
      .populate("user", "name email")
      .lean();

    return res.status(200).json(all);
  } catch (err) {
    console.error("getAllCheckinsForAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

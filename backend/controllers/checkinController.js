import CheckIn from "../models/CheckinModel.js";
import Employee from "../models/Employee.js";

const EXPIRE_MS = 18 * 60 * 60 * 1000; // 18 hours

// 🕒 Auto-finish any old active check-in (without deleting)
async function autoFinishOld(userId) {
  const active = await CheckIn.findOne({
    user: userId,
    checkOutTime: null,
    autoFinished: false,
  });

  if (!active) return null;

  const elapsed = Date.now() - new Date(active.checkInTime).getTime();

  // Agar 18 ghante se zyada ho gaye to auto finish karo
  if (elapsed >= EXPIRE_MS) {
    active.checkOutTime = new Date(active.checkInTime.getTime() + EXPIRE_MS);
    active.autoFinished = true;
    await active.save();
  }

  return active;
}

// 🟢 Create new check-in
export const createCheckin = async (req, res) => {
  try {
    const userId = req.userId;

    // Pehle purana check-in auto-finish kar do
    await autoFinishOld(userId);

    // Check karo koi active (unfinished) check-in already to nahi hai
    const existing = await CheckIn.findOne({
      user: userId,
      checkOutTime: null,
      autoFinished: false,
    });

    if (existing) {
      return res.status(400).json({ message: "Already checked in." });
    }

    const { image, location } = req.body;

    // Naya check-in create karo
    const newCheckin = await CheckIn.create({
      user: userId,
      image,
      location,
      checkInTime: new Date(),
      checkOutTime: null,
      autoFinished: false,
    });

    // Employee ke record me check-in add karo
    const employee = await Employee.findByIdAndUpdate(
      userId,
      { $push: { checkins: newCheckin._id } }, // 'checkins' field fix
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "User not found for check-in" });
    }

    return res.status(200).json(newCheckin);
  } catch (error) {
    console.error("createCheckin error:", error.message);
    return res.status(500).json({
      message: `Error in createCheckIn controller: ${error.message}`,
    });
  }
};


export const getActive = async (req, res) => {
  try {
    await autoFinishOld(req.userId);

    const active = await CheckIn.findOne({
      user: req.userId,
      checkOutTime: null,
      autoFinished: false,
    }).sort({ checkInTime: -1 });

    return res.status(200).json(active);
  } catch (err) {
    console.error("Get active error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};



 export const checkOut = async (req, res) => 
  {
  try {
    const checkin = await CheckIn.findOne({
      user: req.userId,
      checkOutTime: null,
      autoFinished: false,
    });

    if (!checkin) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    checkin.checkOutTime = new Date();
    await checkin.save();

    return res.status(200).json(checkin);
  } catch (error) {
    console.log("Checkout error:", error.message);
    return res.status(500).json({ message: `Error in logout controller: ${error.message}` });
  }
};


// 🟣 Manual Check-Out Controller
export const checkout = async (req, res) => {
  try {
    const userId = req.userId;

    // Pehle active check-in dhoondo
    const activeCheckin = await CheckIn.findOne({
      user: userId,
      checkOutTime: null,
      autoFinished: false,
    });

    if (!activeCheckin) {
      return res.status(400).json({ message: "No active check-in found to check out." });
    }

    // Ab uska checkout time set karo (current time)
    activeCheckin.checkOutTime = new Date();
    activeCheckin.autoFinished = false; // manual checkout
    await activeCheckin.save();

    return res.status(200).json({
      message: "Checked out successfully!",
      data: activeCheckin,
    });
  } catch (error) {
    console.error("checkout error:", error.message);
    return res.status(500).json({
      message: `Error in checkout controller: ${error.message}`,
    });
  }
};


// 🟢 Get all check-in history for logged-in user
export const getCheckinHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const employee = await Employee.findById(userId).select("name email");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find all check-ins for this employee, sorted by newest first
    const history = await CheckIn.find({ user: userId })
      .sort({ checkInTime: -1 })
      .lean();

    // Combine employee info with each check-in record
    const result = history.map((h) => ({
      name: employee.name,
      email: employee.email,
      checkInTime: h.checkInTime,
      checkOutTime: h.checkOutTime,
      status: h.checkOutTime
        ? "Checked Out"
        : h.autoFinished
        ? "Auto Finished"
        : "Active",
      location: h.location,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("getCheckinHistory error:", error.message);
    return res.status(500).json({
      message: `Error in getCheckinHistory controller: ${error.message}`,
    });
  }
};



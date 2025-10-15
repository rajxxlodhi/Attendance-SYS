import API from "./api.js";

// Submit attendance with optional photo
export const submitAttendance = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/attendance", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Attendance submission failed" };
  }
};

// Optional: fetch attendance history
export const getAttendanceHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/attendance", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch history" };
  }
};

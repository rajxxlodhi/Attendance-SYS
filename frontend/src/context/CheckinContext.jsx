import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { userDataContext } from "./UserContext";
import { socketDataContext } from "./SocketContext";
// import { socketDataContext } from "./SocketCOntext";

export const checkinDataContext = createContext();

function CheckinContext({ children }) {
  const { userData } = useContext(userDataContext);
  const socket = useContext(socketDataContext);
  const [active, setActive] = useState(null);

  // Fetch active check-in (from server: image now always URL)
  const fetchActive = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/check/active", {
        withCredentials: true,
      });
      setActive(res.data);
      if (res.data) localStorage.setItem("activeCheckin", JSON.stringify(res.data));
      else localStorage.removeItem("activeCheckin");
    } catch (err) {
      console.error("Active fetch error:", err);
      setActive(null);
      localStorage.removeItem("activeCheckin");
    }
  };

  // Handle check-in (image = base64), backend stores & responds with cloudinary url
  const handleCheckIn = async (image, location) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/check/checkin",
        { image, location },
        { withCredentials: true }
      );
      setActive(res.data);
      localStorage.setItem("activeCheckin", JSON.stringify(res.data));

      // ✅ Notify admin in real-time
      if (socket) socket.emit("checkinEvent", res.data);

      return res.data;
    } catch (err) {
      console.error("Check-in error:", err.response?.data || err.message);
      throw err;
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/check/checkout",
        {},
        { withCredentials: true }
      );
      setActive(null);
      localStorage.removeItem("activeCheckin");

      // ✅ Notify admin in real-time
      if (socket) socket.emit("checkoutEvent", res.data);

      return res.data;
    } catch (err) {
      console.error("Check-out error:", err.response?.data || err.message);
      throw err;
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/check/history", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("History fetch error:", err);
      throw err;
    }
  };

  // Load from localStorage only on initial page load, after that always prefer API/data
  useEffect(() => {
    const saved = localStorage.getItem("activeCheckin");
    if (saved) setActive(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (userData) fetchActive();
  }, [userData]);

  const value = {
    active,
    setActive,
    fetchActive,
    handleCheckIn,
    handleCheckOut,
    fetchHistory,
  };

  return (
    <checkinDataContext.Provider value={value}>
      {children}
    </checkinDataContext.Provider>
  );
}

export default CheckinContext;
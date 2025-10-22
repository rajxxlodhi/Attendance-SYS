// src/context/CheckinContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { userDataContext } from "./UserContext";

export const checkinDataContext = createContext();

function CheckinContext({ children }) {
  const { userData } = useContext(userDataContext);
  const [active, setActive] = useState(null);

  // 🔹 Fetch Active Check-in
  const fetchActive = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/check/active", {
        withCredentials: true,
      });
      setActive(res.data);
    } catch (err) {
      console.error("Active fetch error:", err);
      setActive(null);
    }
  };

  // 🔹 Handle Check-in
  const handleCheckIn = async (image, location) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/check/checkin",
        { image, location },
        { withCredentials: true }
      );
      setActive(res.data);
      localStorage.setItem("activeCheckin", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error("Check-in error:", err.response?.data || err.message);
      throw err;
    }
  };

  // 🔹 Handle Check-out
  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/check/checkout",
        {},
        { withCredentials: true }
      );
      setActive(null);
      localStorage.removeItem("activeCheckin");
      return res.data;
    } catch (err) {
      console.error("Check-out error:", err.response?.data || err.message);
      throw err;
    }
  };

  // 🔹 Fetch Check-in History
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

  // 🔹 Save to localStorage
  useEffect(() => {
    if (active) localStorage.setItem("activeCheckin", JSON.stringify(active));
  }, [active]);

  // 🔹 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("activeCheckin");
    if (saved) setActive(JSON.parse(saved));
  }, []);

  // 🔹 Fetch on login
  useEffect(() => {
    if (userData) fetchActive();
  }, [userData]);

  const value = {
    active,
    setActive,
    fetchActive,
    handleCheckIn,
    handleCheckOut,
    fetchHistory, // ✅ added
  };

  return (
    <checkinDataContext.Provider value={value}>
      {children}
    </checkinDataContext.Provider>
  );
}

export default CheckinContext;

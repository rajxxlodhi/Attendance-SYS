// src/pages/EmployeDashbord.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { userDataContext } from "../context/UserContext";
import { checkinDataContext } from "../context/CheckinContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeDashbord() {
  const { userData, handleLogOut } = useContext(userDataContext);
  const { active, fetchActive, setActive } = useContext(checkinDataContext);
  const [popUp, setPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const popUpRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof fetchActive === "function") fetchActive();
  }, [fetchActive]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popUpRef.current &&
        !popUpRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setPopUp(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateVal) => {
    if (!dateVal) return "-";
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  const handleCheckOut = async () => {
    if (!active) {
      alert("No active check-in found!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/check/checkout",
        {},
        { withCredentials: true }
      );
      alert(res.data.message || "Checked out successfully!");
      setActive(null);
      localStorage.removeItem("activeCheckin");
      await fetchActive();
    } catch (error) {
      console.error("Check-out error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between w-full min-h-[80px] px-6 md:px-10 border-b border-gray-300">
          <div className="text-2xl font-bold text-red-500">
            Employee Attendance
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setPopUp((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 border rounded-full bg-white"
            >
              <GiHamburgerMenu className="w-6 h-6" />
              {userData?.name ? (
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center uppercase">
                  {userData.name[0]}
                </span>
              ) : (
                <CgProfile className="w-7 h-7" />
              )}
            </button>
            {popUp && (
              <div
                ref={popUpRef}
                className="absolute right-0 top-[60px] bg-white shadow-lg rounded-lg py-2 w-52"
              >
                <ul>
                  {userData ? (
                    <li
                      onClick={handleLogOut}
                      className="px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer rounded-md"
                    >
                      Logout
                    </li>
                  ) : (
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md">
                      Login
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center gap-6 pt-[100px] pb-10">
        <h2 className="text-2xl font-semibold">
          Welcome, {userData?.name || "Employee"} 👋
        </h2>

        {/* Buttons */}
        <div className="flex gap-6 flex-wrap justify-center">
          <button
            onClick={() => navigate("/checkin")}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className={`px-8 py-3 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Processing..." : "Check Out"}
          </button>

          {/* ✅ New Button */}
          <button
            onClick={() => navigate("/history")}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            View History
          </button>
        </div>

        {/* Active Checkin Info */}
        {active ? (
          <div className="p-5 bg-white rounded-lg shadow-md mt-6 w-full max-w-md border">
            <h3 className="text-xl font-semibold mb-2">Your Active Check-In</h3>
            <p>
              <strong>Name:</strong> {userData?.name || "-"}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email || "-"}
            </p>
            <p>
              <strong>Check-In Time:</strong> {formatDate(active.checkInTime)}
            </p>
            <p>
              <strong>Latitude:</strong> {active.location?.latitude ?? "-"}
            </p>
            <p>
              <strong>Longitude:</strong> {active.location?.longitude ?? "-"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {active.checkOutTime
                ? "Checked Out"
                : active.autoFinished
                ? "Auto Finished"
                : "Active"}
            </p>
          </div>
        ) : (
          <p className="mt-6 text-gray-600">No active check-in found.</p>
        )}
      </div>
    </div>
  );
}

export default EmployeDashbord;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50 transition-all duration-300">
        <div className="flex items-center justify-between w-full min-h-[70px] px-5 md:px-10 border-b border-gray-200">
          <h1 className="text-xl md:text-2xl font-extrabold text-red-500 tracking-wide">Employee Attendance</h1>

          {/* Profile Menu */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setPopUp((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full bg-white hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <GiHamburgerMenu className="w-5 h-5 text-gray-700" />
              {userData?.name ? (
                <span className="w-8 h-8 rounded-full font-bold bg-gray-900 text-white flex items-center justify-center uppercase text-lg">
                  {userData.name[0]}
                </span>
              ) : (
                <CgProfile className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {popUp && (
              <div
                ref={popUpRef}
                className="absolute right-0 top-[55px] bg-white shadow-xl rounded-xl py-2 w-44 md:w-52 border border-gray-100"
              >
                <ul>
                  {userData ? (
                    <li
                      onClick={handleLogOut}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md text-sm md:text-base transition-all"
                    >
                      Logout
                    </li>
                  ) : (
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md text-sm md:text-base transition-all">
                      Login
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-col items-center gap-8 pt-[100px] pb-12 px-4 md:px-8">
        <h2 className="text-lg md:text-2xl font-semibold text-gray-800 text-center">
          Welcome, <span className="text-red-500">{userData?.name || "Employee"}</span> 👋
        </h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-lg">
          <button
            onClick={() => navigate("/checkin")}
            className="w-full sm:w-auto px-8 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg text-white shadow-md text-sm md:text-base transition-all duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? "Processing..." : "Check Out"}
          </button>

          <button
            onClick={() => navigate("/history")}
            className="w-full sm:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            View History
          </button>
        </div>

        {/* Active Check-in Info */}
        {active ? (
          <div className="p-6 bg-white rounded-2xl shadow-xl mt-6 w-full max-w-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 border-b pb-2 border-gray-200">Your Active Check-In</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-sm md:text-base space-y-2">
                <p className="font-bold text-lg text-gray-900">{userData?.name || "-"}</p>
                <p><strong>Email:</strong> {userData?.email || "-"}</p>
                <p><strong>Check-In :</strong> {formatDate(active.checkInTime)}</p>
                <p><strong>Latitude:</strong> {active.location?.latitude ?? "-"}</p>
                <p><strong>Longitude:</strong> {active.location?.longitude ?? "-"}</p>
                <p><strong>Status:</strong> <span className={`${active.checkOutTime ? "text-red-600" : active.autoFinished ? "text-yellow-600" : "text-green-600"} font-semibold`}>{active.checkOutTime ? "Checked Out" : active.autoFinished ? "Auto Finished" : "Active"}</span></p>
              </div>

              {/* Right: Image */}
              {active.image && (
                <div className="flex-shrink-0 mt-5 md:mt-0 md:ml-5 flex items-center justify-center">
                  <img
                    src={active.image}
                    alt="Check-in"
                    className="w-36 h-36 md:w-40 md:h-40 rounded-xl border border-gray-200 object-cover shadow-md hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/140?text=Image+Not+Found";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-6 text-gray-600 text-sm md:text-base text-center">No active check-in found.</p>
        )}
      </main>
    </div>
  );
}

export default EmployeDashbord;

import React, { useContext, useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { socketDataContext } from "../context/SocketCOntext";

function AdminDashBord() {
  const { userData, handleLogOut } = useContext(userDataContext);
  const socket = useContext(socketDataContext);
  const [popUp, setPopUp] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  const popUpRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch all check-ins initially
  const fetchAllCheckins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/checkins", {
        withCredentials: true,
      });
      setCheckins(res.data || []);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.role === "admin") fetchAllCheckins();
  }, [userData]);

  // ✅ Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewCheckin = (data) => {
      console.log("🟢 New check-in received:", data);
      setCheckins((prev) => [data, ...prev]);
    };

    const handleUpdateCheckin = (data) => {
      console.log("🔵 Check-in updated:", data);
      setCheckins((prev) =>
        prev.map((item) => (item._id === data._id ? data : item))
      );
    };

    const handleEmployeeCheckedOut = (data) => {
      console.log("🔴 Employee checked out:", data);
      setCheckins((prev) =>
        prev.filter((item) => item._id !== data.checkInId)
      );
    };

    socket.on("newCheckin", handleNewCheckin);
    socket.on("updateCheckin", handleUpdateCheckin);
    socket.on("employeeCheckedOut", handleEmployeeCheckedOut);

    return () => {
      socket.off("newCheckin", handleNewCheckin);
      socket.off("updateCheckin", handleUpdateCheckin);
      socket.off("employeeCheckedOut", handleEmployeeCheckedOut);
    };
  }, [socket]);

  const handleButtonClick = () => setPopUp((p) => !p);

  const renderLocation = (loc) => {
    if (!loc) return "Not Available";
    if (typeof loc === "string") return loc;
    if (typeof loc === "object") {
      const { latitude, longitude, address } = loc;
      if (address) return address;
      if (latitude && longitude) return `Lat: ${latitude}, Long: ${longitude}`;
    }
    return "Not Available";
  };

  const handleViewHistory = (userId) => navigate(`/history/${userId}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between w-full min-h-[80px] px-6 md:px-12 lg:px-20 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <div className="text-2xl sm:text-3xl font-bold text-red-500">
              Admin Dashboard
            </div>
            {/* 🧩 View All Employees Button */}
            <button
              onClick={() => navigate("/allEmployes")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-2 rounded-lg shadow-md transition"
            >
              View All Employees
            </button>
          </div>

          {/* Profile Menu */}
          <div className="flex items-center gap-4 relative">
            <button
              ref={buttonRef}
              onClick={handleButtonClick}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:shadow-lg transition"
            >
              <GiHamburgerMenu className="w-6 h-6 text-gray-700" />
              {userData ? (
                <span className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg uppercase">
                  {userData.name?.charAt(0)}
                </span>
              ) : (
                <CgProfile className="w-7 h-7 text-gray-700" />
              )}
            </button>

            {popUp && (
              <div
                ref={popUpRef}
                className="absolute right-0 top-[60px] w-52 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <ul className="flex flex-col text-gray-700 text-base sm:text-lg">
                  {!userData ? (
                    <li
                      onClick={() => navigate("/login")}
                      className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                    >
                      Login
                    </li>
                  ) : (
                    <li
                      onClick={handleLogOut}
                      className="w-full px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer rounded-md"
                    >
                      Logout
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="pt-[100px] px-6 md:px-12 lg:px-20">
        <h2 className="text-2xl font-semibold mb-6">Employee Check-In Records</h2>

        {loading ? (
          <p>Loading check-ins...</p>
        ) : checkins.length === 0 ? (
          <p>No check-ins found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-700">
                  <th className="py-3 px-4 border-b">Employee</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Check-In</th>
                  <th className="py-3 px-4 border-b">Check-Out</th>
                  <th className="py-3 px-4 border-b">Location</th>
                  <th className="py-3 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {checkins.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td
                      onClick={() => handleViewHistory(c.user?._id)}
                      className="py-3 px-4 border-b text-blue-600 hover:underline cursor-pointer"
                    >
                      {c.user?.name || "Unknown"}
                    </td>
                    <td className="py-3 px-4 border-b">{c.user?.email || "N/A"}</td>
                    <td className="py-3 px-4 border-b">
                      {c.checkInTime ? new Date(c.checkInTime).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {c.checkOutTime ? new Date(c.checkOutTime).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-4 border-b">{renderLocation(c.location)}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          c.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashBord;

import React, { useContext, useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { socketDataContext } from "../context/SocketContext";

function AdminDashBord() {
  const { userData, handleLogOut } = useContext(userDataContext);
  const socket = useContext(socketDataContext);
  const [popUp, setPopUp] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

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

    const handleViewHistory = (userId) => {
    if (!userId) return;
    navigate(`/history/${userId}`);
  };

  useEffect(() => {
    if (userData?.role === "admin") fetchAllCheckins();
  }, [userData]);

  useEffect(() => {
    if (!socket) return;

    const handleNewCheckin = (data) => setCheckins((prev) => [data, ...prev]);
    const handleUpdateCheckin = (data) =>
      setCheckins((prev) => prev.map((item) => (item._id === data._id ? data : item)));
    const handleEmployeeCheckedOut = (data) =>
      setCheckins((prev) => prev.filter((item) => item._id !== data.checkInId));
    const handleAutoFinishCheckin = (data) =>
      setCheckins((prev) => prev.filter((item) => item._id !== data.checkInId));

    socket.on("newCheckin", handleNewCheckin);
    socket.on("updateCheckin", handleUpdateCheckin);
    socket.on("employeeCheckedOut", handleEmployeeCheckedOut);
    socket.on("autoFinishCheckin", handleAutoFinishCheckin);

    return () => {
      socket.off("newCheckin", handleNewCheckin);
      socket.off("updateCheckin", handleUpdateCheckin);
      socket.off("employeeCheckedOut", handleEmployeeCheckedOut);
      socket.off("autoFinishCheckin", handleAutoFinishCheckin);
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

  // ✅ Navigate to employee detail page
  const handleRowClick = (checkinId) => {
    navigate(`/employee/${checkinId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 min-h-[70px] border-b border-gray-200">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-red-500">
            Admin Dashboard
          </h1>
          {/* Profile */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleButtonClick}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:shadow-md transition"
            >
              <GiHamburgerMenu className="w-5 h-5 text-gray-700" />
              {userData ? (
                <span className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg uppercase">
                  {userData.name?.charAt(0)}
                </span>
              ) : (
                <CgProfile className="w-6 h-6 text-gray-700" />
              )}
            </button>
            {popUp && (
              <div
                ref={popUpRef}
                className="absolute right-0 top-[55px] w-44 sm:w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
              >
                <ul className="flex flex-col text-gray-700 text-sm sm:text-base">
                  {!userData ? (
                    <li
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Login
                    </li>
                  ) : (
                    <li
                      onClick={handleLogOut}
                      className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                    >
                      Logout
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="pt-[90px] px-3 sm:px-5 md:px-10 lg:px-20 pb-10 flex-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 text-center flex-1">
            Employee Check-In Records
          </h2>
          <button
            onClick={() => navigate("/allEmployes")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition text-sm sm:text-base"
          >
            View All Employees
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-sm sm:text-base">Loading check-ins...</p>
        ) : checkins.length === 0 ? (
          <p className="text-center text-gray-600 text-sm sm:text-base">No check-ins found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="py-3 px-2 sm:px-4 text-left">Employee</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Email</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Image</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Check-In</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Check-Out</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Location</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Status</th>
                </tr>
              </thead>
             <tbody>
  {checkins.map((c) => (
    <tr
      key={c._id}
      onClick={(e) => {
        // Prevent triggering when clicking on name
        if (!e.target.closest(".name-cell")) {
          handleRowClick(c._id);
        }
      }}
      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition"
    >
      {/* ✅ Employee Name Click Opens History */}
      <td
        className="py-3 px-2 sm:px-4 font-medium truncate max-w-[150px] sm:max-w-none text-blue-600 hover:underline cursor-pointer name-cell"
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering row click
          handleViewHistory(c.user?._id);
        }}
      >
        {c.user?.name || "Unknown"}
      </td>

      <td className="py-3 px-2 sm:px-4 truncate max-w-[180px]">
        {c.user?.email || "N/A"}
      </td>

      <td className="py-3 px-2 sm:px-4">
        {c.image ? (
          <img
            src={c.image}
            alt="thumb"
            className="w-12 h-12 rounded-md object-cover border border-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=No+Img";
            }}
          />
        ) : (
          <span className="text-xs text-gray-500">—</span>
        )}
      </td>

      <td className="py-3 px-2 sm:px-4">
        {c.checkInTime ? new Date(c.checkInTime).toLocaleString() : "—"}
      </td>

      <td className="py-3 px-2 sm:px-4">
        {c.checkOutTime ? new Date(c.checkOutTime).toLocaleString() : "—"}
      </td>

      <td className="py-3 px-2 sm:px-4 truncate max-w-[200px]">
        {renderLocation(c.location)}
      </td>

      <td className="py-3 px-2 sm:px-4">
        <span
          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
            c.status?.toLowerCase() === "active"
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
      </main>
    </div>
  );
}

export default AdminDashBord;

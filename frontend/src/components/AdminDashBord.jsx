import React, { useContext, useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function AdminDashBord() {
  const { userData, handleLogOut } = useContext(userDataContext);
  const [popUp, setPopUp] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  const popUpRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch all check-ins (Admin only)
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

  // ✅ Close popup when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popUpRef.current &&
        !popUpRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setPopUp(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleViewHistory = (userId) => {
    navigate(`/history/${userId}`);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between w-full min-h-[80px] px-6 md:px-12 lg:px-20 border-b border-gray-300">
          <div className="text-2xl sm:text-3xl font-bold text-red-500">
            Admin Dashboard
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

      {/* Body */}
      <div className="pt-[100px] px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Employee Check-In Records
          </h2>

          {/* ✅ View All Employees Button */}
          <button
            onClick={()=>navigate("/allEmployes")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            View All Employees
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading check-ins...</p>
        ) : checkins.length === 0 ? (
          <p className="text-gray-600">No check-ins found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-700">
                  <th className="py-3 px-4 border-b">Employee Name</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Check-In Time</th>
                  <th className="py-3 px-4 border-b">Check-Out Time</th>
                  <th className="py-3 px-4 border-b">Location</th>
                  <th className="py-3 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {checkins.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td
                      className="py-3 px-4 border-b text-blue-600 font-medium cursor-pointer hover:underline"
                      onClick={() => handleViewHistory(c.user?._id)}
                    >
                      {c.user?.name || "Unknown"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {c.user?.email || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {c.checkInTime
                        ? new Date(c.checkInTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {c.checkOutTime
                        ? new Date(c.checkOutTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {renderLocation(c.location)}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          c.status === "active"
                            ? "bg-green-100 text-green-700"
                            : c.status === "checked-out"
                            ? "bg-blue-100 text-blue-700"
                            : c.status === "auto-finished"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {c.status === "active"
                          ? "Active"
                          : c.status === "checked-out"
                          ? "Checked Out"
                          : c.status === "auto-finished"
                          ? "Auto Finished"
                          : "Unknown"}
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

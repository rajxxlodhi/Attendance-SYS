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
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [popUp, setPopUp] = useState(false);
  const popUpRef = useRef(null);
  const buttonRef = useRef(null);

  // --- Utility Functions ---

  const fetchAllCheckins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/checkins", {
        withCredentials: true,
      });
      const data = res.data || [];
      setCheckins(data);

      // ✅ Fetch address if missing
      data.forEach((c) => {
        if (
          c.location &&
          !c.location.address &&
          c.location.latitude &&
          c.location.longitude
        ) {
          fetchAddressFromCoords(c.location.latitude, c.location.longitude, c._id);
        }
      });
    } catch (error) {
      console.error("Error fetching check-ins:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressFromCoords = async (lat, lon, id) => {
    const apiKey = import.meta.env.VITE_GEOAPIKEY || "19e7a87a11564e6ba859a020238937c9";
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`
      );
      const address = res.data.results?.[0]?.formatted;
      if (address) {
        setCheckins((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, location: { ...c.location, address } } : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch address for:", lat, lon, err);
    }
  };

  const renderLocation = (loc) => {
    if (!loc) return "N/A";
    if (loc.address) return loc.address;
    if (loc.latitude && loc.longitude)
      return `Lat: ${loc.latitude}, Long: ${loc.longitude}`;
    return "N/A";
  };

  const handleViewHistory = (userId) => {
    if (!userId) return;
    navigate(`/history/${userId}`);
  };

  const handleRowClick = (checkinId) => {
    navigate(`/employee/${checkinId}`);
  };

  // 🆕 New handler for navigating to the all employees list
  const handleViewAllEmployees = () => {
    navigate(`/allEmployes`); // Assuming the route for all employees is /employees
  };

  const renderStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase();
    let colorClass = "bg-gray-100 text-gray-700";
    let icon = "⏳";

    if (lowerStatus === "active") {
      colorClass = "bg-green-100 text-green-700 font-bold";
      icon = "🟢";
    } else if (lowerStatus === "checked-out") {
      colorClass = "bg-blue-100 text-blue-700";
      icon = "✅";
    } else if (lowerStatus === "auto-finished") {
      colorClass = "bg-yellow-100 text-yellow-700";
      icon = "⚠️";
    }

    // Larger font and padding for badge
    return (
      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${colorClass}`}>
        {icon} {status}
      </span>
    );
  };

  
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

  // --- useEffects (Socket/Data Fetching) ---

  useEffect(() => {
    if (userData?.role === "admin") fetchAllCheckins();
  }, [userData]);

  useEffect(() => {
    if (!socket) return;

    const handleNewCheckin = (data) => {
      setCheckins((prev) => [data, ...prev]);
      if (
        data.location &&
        !data.location.address &&
        data.location.latitude &&
        data.location.longitude
      ) {
        fetchAddressFromCoords(data.location.latitude, data.location.longitude, data._id);
      }
    };

    const handleUpdateCheckin = (data) =>
      setCheckins((prev) => prev.map((i) => (i._id === data._id ? data : i)));

    const handleRemove = (data) =>
      setCheckins((prev) => prev.filter((i) => i._id !== data.checkInId));

    socket.on("newCheckin", handleNewCheckin);
    socket.on("updateCheckin", handleUpdateCheckin); 
    socket.on("employeeCheckedOut", handleRemove);

    return () => {
      socket.off("newCheckin", handleNewCheckin);
      socket.off("updateCheckin", handleUpdateCheckin);
      socket.off("employeeCheckedOut", handleRemove);
    };
  }, [socket]);

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header (Formal and Responsive) */}
      <header className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="flex justify-between items-center px-4 sm:px-8 py-4 border-b border-gray-100">
          <h1 className="text-xl sm:text-2xl font-extrabold text-red-600 tracking-wider">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* 🆕 New Button: View All Employees */}
            <button
              onClick={handleViewAllEmployees}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              View All Employees
            </button>
            
            {/* <span className="hidden sm:inline text-gray-700 font-medium text-base">{userData?.name || "Admin"}</span> */}
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
        </div>
      </header>
      
      {/* Main Content (Responsive Padding) */}
      <main className="pt-[90px] px-4 sm:px-8 pb-10 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Employee Attendance Records</h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-lg text-gray-600">Loading records...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            
            {/* Table Wrapper (Allows horizontal scroll on small screens for full column visibility) */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-base"> 
                <thead className="bg-gray-50">
                  <tr>
                    {/* Headers: Left-aligned, slightly larger text-sm */}
                    <th className="px-5 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      Employee
                    </th>
                    <th className="px-5 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider min-w-[250px]">
                      Email
                    </th>
                    <th className="px-5 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider min-w-[80px]">
                      Image
                    </th>
                    <th className="px-5 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider min-w-[180px]">
                      Check-In Time
                    </th>
                    <th className="px-5 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider min-w-[300px]">
                      Location
                    </th>
                    <th className="px-5 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider min-w-[140px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {checkins.map((c) => (
                    <tr 
                      key={c._id} 
                      className="hover:bg-red-50/50 transition-colors duration-150 cursor-pointer"
                      onClick={(e) => {
                        if (!e.target.closest(".history-link")) {
                          handleRowClick(c._id);
                        }
                      }}>
                      
                      {/* Name (History Link) */}
                      <td className="px-5 py-4 whitespace-nowrap text-base">
                        <span 
                          className="font-semibold text-blue-700 hover:text-red-600 transition-colors history-link underline"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleViewHistory(c.user?._id);
                          }}>
                          {c.user?.name || 'N/A'}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap text-sm">
                        {c.user?.email || 'N/A'}
                      </td>

                      {/* Image */}
                      <td className="px-5 py-4">
                        <img
                          src={c.image || 'https://via.placeholder.com/32?text=No+Img'}
                          alt="checkin"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      </td>

                      {/* Check-In Time */}
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap text-sm">
                        {new Date(c.checkInTime).toLocaleString()}
                      </td>
                      
                      {/* Location */}
                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {renderLocation(c.location)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {renderStatusBadge(c.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {checkins.length === 0 && !loading && (
                <p className="p-8 text-center text-gray-500">No check-in records found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashBord;
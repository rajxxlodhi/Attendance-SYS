import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";

function EmployeeDetails() {
  const { checkinId } = useParams();
  const [checkin, setCheckin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckinDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/checkin/${checkinId}`, {
          withCredentials: true,
        });
        setCheckin(res.data);
      } catch (error) {
        console.error("Error fetching checkin details:", error);
      }
    };
    fetchCheckinDetails();
  }, [checkinId]);

  if (!checkin)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading employee details...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 md:px-10 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-all mb-6 font-medium text-base sm:text-lg"
      >
        <FaArrowLeftLong className="transition-transform duration-300 group-hover:-translate-x-1" /> 
        Back
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Top Section */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 py-8 px-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={checkin.image || "https://via.placeholder.com/100?text=No+Img"}
            alt="Employee"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-gray-200 object-cover shadow-md"
          />
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide">
              {checkin.user?.name || "Unknown"}
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {checkin.user?.email || "No Email"}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 sm:p-8 space-y-4 sm:space-y-5 text-gray-700 text-sm sm:text-base">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between border-b border-gray-100 pb-3"
          >
            <strong className="text-gray-800">Status:</strong>
            <span
              className={`px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm shadow-sm ${
                checkin.status?.toLowerCase() === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {checkin.status}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between border-b border-gray-100 pb-3"
          >
            <strong className="text-gray-800">Check-In Time:</strong>
            <span className="text-gray-600 font-medium">
              {checkin.checkInTime ? new Date(checkin.checkInTime).toLocaleString() : "—"}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between border-b border-gray-100 pb-3"
          >
            <strong className="text-gray-800">Check-Out Time:</strong>
            <span className="text-gray-600 font-medium">
              {checkin.checkOutTime ? new Date(checkin.checkOutTime).toLocaleString() : "—"}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between pt-3"
          >
            <strong className="text-gray-800 mb-1 sm:mb-0">Location:</strong>
            <span className="text-gray-600 font-medium break-words sm:text-right">
              {typeof checkin.location === "object"
                ? checkin.location.address ||
                  `Lat: ${checkin.location.latitude}, Long: ${checkin.location.longitude}`
                : checkin.location || "Not Available"}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer note */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>Employee check-in details • Updated in real-time</p>
      </div>
    </div>
  );
}

export default EmployeeDetails;

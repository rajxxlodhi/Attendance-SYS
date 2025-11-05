import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
// Removed: import { motion } from "framer-motion";

function EmployeeDetails() {
  const { checkinId } = useParams();
  const [checkin, setCheckin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state for error handling
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckinDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/checkin/${checkinId}`, {
          withCredentials: true,
        });
        setCheckin(res.data);
      } catch (err) {
        console.error("Error fetching checkin details:", err);
        setError("Could not load check-in details. The ID may be invalid.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckinDetails();
  }, [checkinId]);

  const renderStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase();
    let colorClass = "bg-gray-100 text-gray-700";

    if (lowerStatus === "active") {
      colorClass = "bg-green-100 text-green-700 ring-1 ring-green-300";
    } else if (lowerStatus === "checked-out") {
      colorClass = "bg-blue-100 text-blue-700 ring-1 ring-blue-300";
    } else if (lowerStatus === "auto-finished") {
      colorClass = "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300";
    }

    return (
      <span
        className={`px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm shadow-sm ${colorClass}`}
      >
        {status}
      </span>
    );
  };

  const renderLocation = (loc) => {
    if (!loc) return "Not Available";
    if (typeof loc === "object") {
      return loc.address || `Lat: ${loc.latitude}, Long: ${loc.longitude}`;
    }
    return loc || "Not Available";
  };

  const formatDate = (dateVal) => {
    return dateVal ? new Date(dateVal).toLocaleString() : "—";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-6 w-6 text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg">Loading employee details...</p>
        </div>
      </div>
    );
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg p-8 border border-red-200 bg-red-50 rounded-lg shadow-md">{error}</p>
      </div>
    );
  }

  if (!checkin) {
    // Should be covered by error handling, but good fallback
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Check-in data not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 md:px-10 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-gray-700 hover:text-red-600 transition-all mb-8 font-semibold text-base sm:text-lg focus:outline-none"
      >
        <FaArrowLeftLong className="transition-transform duration-300 group-hover:-translate-x-1" />
        Back to Dashboard
      </button>

      {/* Main Detail Card */}
      <div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-gray-200 bg-red-50/50">
          <div className="md:col-span-1 flex justify-center items-start">
            <img
              src={checkin.image || "https://via.placeholder.com/120?text=No+Image"}
              alt="Employee Check-in"
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
          
          <div className="md:col-span-2 text-center md:text-left pt-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {checkin.user?.name || "Employee Not Found"}
            </h1>
            <p className="text-xl text-gray-600 mt-1">
              {checkin.user?.email || "No Email Address"}
            </p>
            <div className="mt-4">
              <strong className="text-gray-700 text-lg">Current Status: </strong>
              {renderStatusBadge(checkin.status)}
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Attendance Log</h2>
          
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            
            {/* Check-In Time */}
            <div className="border-l-4 border-green-500 pl-4">
              <dt className="text-sm font-medium text-gray-500 uppercase">Check-In Time</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {formatDate(checkin.checkInTime)}
              </dd>
            </div>

            {/* Check-Out Time */}
            <div className={`border-l-4 pl-4 ${checkin.checkOutTime ? 'border-red-500' : 'border-gray-300'}`}>
              <dt className="text-sm font-medium text-gray-500 uppercase">Check-Out Time</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {formatDate(checkin.checkOutTime)}
              </dd>
            </div>
            
            {/* Auto-Finished Flag */}
            <div className="border-l-4 border-gray-300 pl-4">
              <dt className="text-sm font-medium text-gray-500 uppercase">Auto-Finished</dt>
              <dd className={`mt-1 text-lg font-semibold ${checkin.autoFinished ? 'text-yellow-600' : 'text-gray-900'}`}>
                {checkin.autoFinished ? "Yes" : "No"}
              </dd>
            </div>

            {/* Record ID */}
            <div className="border-l-4 border-gray-300 pl-4">
              <dt className="text-sm font-medium text-gray-500 uppercase">Record ID</dt>
              <dd className="mt-1 text-md font-mono text-gray-700 break-all">
                {checkin._id}
              </dd>
            </div>

            {/* Location Address */}
            <div className="sm:col-span-2 border-l-4 border-blue-500 pl-4">
              <dt className="text-sm font-medium text-gray-500 uppercase">Location / Address</dt>
              <dd className="mt-1 text-lg font-medium text-gray-900 leading-relaxed">
                {renderLocation(checkin.location)}
              </dd>
            </div>

          </dl>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center mt-10 text-gray-500 text-sm">
        <p>Administrative Detail View • Check-in record is authoritative.</p>
      </div>
    </div>
  );
}

export default EmployeeDetails;
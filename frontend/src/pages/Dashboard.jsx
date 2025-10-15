import { useState } from "react";
import { submitAttendance } from "../services/attendanceService.js";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);

  // // Get geolocation
  // const getCurrentPosition = () => {
  //   return new Promise((resolve, reject) =>
  //     navigator.geolocation.getCurrentPosition(resolve, reject)
  //   );
  // };

  // // Handle attendance
  // const handleAttendance = async (type) => {
  //   try {
  //     const position = await getCurrentPosition();
  //     const currentLocation = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude,
  //     };
  //     setLocation(currentLocation);

  //     // Prepare form data for photo upload
  //     const formData = new FormData();
  //     formData.append("type", type);
  //     formData.append("location", JSON.stringify(currentLocation));
  //     if (photo) formData.append("photo", photo);

  //     const data = await submitAttendance(formData);
  //     setMessage(data.message);
  //   } catch (err) {
  //     console.error(err);
  //     setMessage(err.message || "Error submitting attendance");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
  <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>

  <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl flex flex-col items-center">
    <input
      type="file"
      accept="image/*"
      className="mb-4 w-full text-gray-700"
    />

    <div className="flex space-x-6 mb-4">
      <button className="bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-600 transition">
        Check-In
      </button>
      <button className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition">
        Check-Out
      </button>
    </div>

    {location && (
      <p className="mb-2 text-gray-600 font-medium">
        Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
      </p>
    )}

    {message && (
      <p className="text-blue-600 font-semibold mt-2">{message}</p>
    )}
  </div>
</div>

  );
};

export default Dashboard;

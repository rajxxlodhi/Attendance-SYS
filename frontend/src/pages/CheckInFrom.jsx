// src/pages/CheckInForm.jsx
import axios from "axios";
import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { checkinDataContext } from "../context/CheckinContext";

function CheckInForm() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { setActive } = useContext(checkinDataContext);

  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [location, setLocation] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error(err);
      alert("Cannot access camera: " + err.message);
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCaptured(dataUrl);

    if (stream) stream.getTracks().forEach((track) => track.stop());
    setCameraActive(false);
  };

  const getLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => alert("Location error: " + err.message)
    );
  };

  const submit = async () => {
    if (!captured || !location)
      return alert("Please capture a photo and get location before submitting.");
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/check/checkin", // <<< corrected path
        { image: captured, location },
        { withCredentials: true }
      );
      alert("✅ Check-in successful!");
      // backend sends populated checkin; store active locally as the returned doc
      setActive(res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-2xl max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-10 border border-gray-200">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center leading-snug">
        Employee Daily Check-In
      </h2>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 w-full">
        {!cameraActive && !captured && (
          <button
            onClick={startCamera}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-600 transition"
          >
            Open Camera
          </button>
        )}
        {cameraActive && (
          <button
            onClick={capture}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-green-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-green-600 transition"
          >
            Capture Photo
          </button>
        )}
        <button
          onClick={getLocation}
          className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-yellow-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-yellow-600 transition"
        >
          Get Location
        </button>
        {captured && (
          <button
            onClick={() => {
              setCaptured(null);
              startCamera();
            }}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-gray-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-gray-600 transition"
          >
            Retake Photo
          </button>
        )}
      </div>

      <video
        ref={videoRef}
        className={`rounded-lg w-full max-w-[320px] sm:max-w-[400px] h-auto aspect-video ${cameraActive ? "block" : "hidden"}`}
        autoPlay
      ></video>

      <canvas ref={canvasRef} className="hidden"></canvas>

      {captured && (
        <img src={captured} alt="Captured Preview" className="rounded-lg w-full max-w-[320px] sm:max-w-[400px] mt-5 object-cover" />
      )}

      {location && (
        <p className="mt-4 text-gray-700 text-sm sm:text-base text-center break-words">
          <span className="font-semibold">Latitude:</span> {location.latitude}
          <br />
          <span className="font-semibold">Longitude:</span> {location.longitude}
        </p>
      )}

      {captured && location && (
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Checking In..." : "Submit Check-In"}
        </button>
      )}
    </div>
  );
}

export default CheckInForm;

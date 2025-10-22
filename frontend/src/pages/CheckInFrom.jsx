import axios from "axios";
import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { checkinDataContext } from "../context/CheckinContext";

function CheckInForm() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { setActive } = useContext(checkinDataContext); // ✅ use context

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

    if (stream) stream.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  };

  const getLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      err => alert("Location error: " + err.message)
    );
  };

  const submit = async () => {
    if (!captured || !location) return alert("Capture photo and location first");
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/Api/check/checkin",
        { image: captured, location },
        { withCredentials: true }
      );
      console.log(res.data)
      alert("✅ Check-in successful!");
     setActive(res.data.newCheckin || res.data);// ✅ update context immediately
      navigate("/"); // redirect to dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl max-w-md mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Employee Daily Check-In</h2>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {!cameraActive && !captured && <button onClick={startCamera} className="px-5 py-2 bg-blue-500 text-white rounded-lg">Open Camera</button>}
        {cameraActive && <button onClick={capture} className="px-5 py-2 bg-green-500 text-white rounded-lg">Capture Photo</button>}
        <button onClick={getLocation} className="px-5 py-2 bg-yellow-500 text-white rounded-lg">Get Location</button>
        {captured && <button onClick={() => { setCaptured(null); startCamera(); }} className="px-5 py-2 bg-gray-500 text-white rounded-lg">Retake Photo</button>}
      </div>

      <video ref={videoRef} className={`rounded-lg w-[320px] h-[240px] ${cameraActive ? "block" : "hidden"}`} autoPlay></video>
      <canvas ref={canvasRef} className="hidden"></canvas>

      {captured && <img src={captured} alt="Captured Preview" className="rounded-lg w-[320px] mt-5"/>}
      {location && <p className="mt-4 text-gray-700 w-full text-nowrap">Latitude: {location.latitude}, Longitude: {location.longitude}</p>}

      {captured && location && <button onClick={submit} disabled={loading} className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg">{loading ? "Checking In..." : "Submit Check-In"}</button>}
    </div>
  );
}

export default CheckInForm;

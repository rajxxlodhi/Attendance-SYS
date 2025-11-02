import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { userDataContext } from "./context/UserContext.jsx";
import Home from "./pages/Home.jsx";
import CheckInFrom from "./pages/CheckInFrom.jsx";
import CheckinHistory from "./pages/CheckinHistory.jsx";
import UserHistory from "./pages/UserHistory.jsx";
import AllEmployes from "./pages/AllEmployes.jsx";
import { useEffect } from "react";
import {io} from "socket.io-client"

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <>
      <ToastContainer />
      <Routes>
  
            <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
            <Route path="/register" element={!userData ? <Register /> : <Navigate to="/" />} />
            <Route path="/login"element={!userData ? <Login /> : <Navigate to="/" />}/>
            <Route path="/checkin" element={userData ? <CheckInFrom /> : <Navigate to="/login" />}/>
            <Route path="/history" element={userData ? <CheckinHistory /> : <Navigate to="/login" />}/>
            <Route path="/history/:id" element={userData ? <UserHistory /> : <Navigate to="/login" />}/>
            <Route path="/allEmployes"element={userData ? <AllEmployes /> : <Navigate to="/login" />}/>
            
      </Routes>
    </>
  );
}

export default App;

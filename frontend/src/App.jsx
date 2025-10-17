import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { userDataContext } from "./context/UserContext.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/register" element={ userData == null? <Register />: <Navigate to={"/"}/> } />
        <Route path="/login" element={ userData == null? <Login />: <Navigate to={"/"}/> } /> */}
        <Route path="/register" element={<Register /> } />
        <Route path="/login" element={ <Login />} />
      </Routes>
    </>
  );
}

export default App;

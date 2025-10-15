import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
  <> <ToastContainer />
    <Router>
      <Routes>
         <Route path="/" element={<Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  
  </>);
}

export default App;

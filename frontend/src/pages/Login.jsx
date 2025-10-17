import { useContext, useState } from "react";
import API from "../services/api.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  let [loading, setLoading] = useState(false)

  let {setUserData} = useContext(userDataContext)

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/Api/auth/login", { email, password },{withCredentials:true});
      toast.success("Login successfully");
      navigate ("/")
      setUserData(res.data)
      console.log(res.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
      toast.error(err.response.data.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>

        {/* Email Input */}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Password Input with Eye Icon */}
        <div className="relative mb-6">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div
            className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-3 rounded-xl transition duration-300`}
        >
          {loading ? "login..." : "Login"}
        </button>

         <p className="mt-4 text-center text-gray-600">
          Create a new account?{" "}
          <a onClick={()=>navigate("/register")} className="text-blue-600 font-medium hover:underline cursor-pointer">
            Register
          </a>
        </p>

      </form>
    </div>

  );
};

export default Login;

import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { userDataContext } from "../context/UserContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });

  const primaryColor = "#3B82F6";
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
   let {setUserData} = useContext(userDataContext)

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  let key = import.meta.env.VITE_ADMIN_KEY
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check secret key only for admin
    if (role === "admin" && formData.secretKey != key ) {
      toast.error("Invalid Admin Secret Key");
      return; // Stop submission
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        role,
      },{withCredentials:true});

      toast.success("Registration successful!");
      navigate("/");
      setUserData(res.data)
      console.log(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle role change (auto clear secretKey when switching to employee)
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "employee") {
      setFormData({ ...formData, secretKey: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {role === "admin" ? "Admin Registration" : "Employee Registration"}
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-gray-600 font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your password"
            required
          />
          <div
            className="absolute right-4 top-11 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </div>
        </div>

        {/* Role Buttons */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2 flex-wrap">
            {["employee", "admin"].map((r, index) => (
              <button
                key={index}
                type="button"
                className="flex-1 rounded-lg border px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => handleRoleChange(r)}
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Secret Key (Only for Admin) */}
        {role === "admin" && (
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">
              Secret Key
            </label>
            <input
              type="text"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter admin secret key"
              required={role === "admin"}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-3 rounded-xl transition duration-300`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a onClick={()=>navigate("/login")} className="text-blue-600 font-medium hover:underline cursor-pointer">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;

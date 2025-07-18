import { useState } from "react";
import { axiosInstance } from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post("/login", { email, password });
      console.log(res.data);
      localStorage.setItem("token", res.data.accessToken);
      navigate("/home");
    } catch (err) {
      console.log(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center pt-2" onClick={() => navigate("/register")}>
          Don't have an account?
          <span className=" text-blue-700">Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { axiosInstance } from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axiosInstance.post("/register", { name, email, password });
      console.log("Registered successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-3 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={handleRegister}
        >
          Register
        </button>
        <p className="text-center pt-2" onClick={() => navigate("/")}>
          Already have an account? <span className="text-blue-600"> Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;

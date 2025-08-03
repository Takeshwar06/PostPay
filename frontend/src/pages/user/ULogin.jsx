import axios from "axios";
import React, { use, useState } from "react";
import { host } from "../../services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ULogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      console.log("Please fill all fields");
      return;
    }
    try {
      const response = await axios.post(`${host}/api/v1/auth/login-user`, {
        phone,
        password,
      });
      console.log(response.data);
      localStorage.setItem("accessToken", response.data?.data?.accessToken);
      localStorage.setItem("refreshToken", response.data?.data?.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data?.data?.user));
      dispatch(
        loginSuccess({
          accessToken: response.data?.data?.accessToken,
          refreshToken: response.data?.data?.refreshToken,
          user: response.data?.data?.user,
        })
      );
      toast.success("Login successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      const { message } = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          User Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="number"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/auth/user-register"
              className="text-blue-600 hover:underline"
            >
              Register here
            </a>
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => navigate("/auth/account-login")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                border: "none",
              }}
            >
              Account Login
            </button>

            <button
              onClick={() => navigate("/auth/admin-login")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                borderRadius: "5px",
                border: "none",
              }}
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import axios from "axios";
import React, { useState } from "react";
import { host } from "../../services/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../features/auth/authSlice";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { toast } from "react-toastify";

export default function AccRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${host}/api/v1/auth/register-account-person`,
        {
          phone,
          password,
        }
      );
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
      toast.success("Account Registration successful");
      navigate("/account-dash", { replace: true });
    } catch (error) {
      console.log(error);
      const {message} = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Account Registration
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
       
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

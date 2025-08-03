import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { loginSuccess, logoutUser } from "../../features/auth/authSlice";

export default function Container() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(accessToken, refreshToken);
    if (accessToken && refreshToken) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch(loginSuccess({ accessToken, refreshToken, user }));
    } else {
      dispatch(logoutUser());
      navigate("/auth/user-login");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <div onClick={() => navigate("/")} className="text-2xl font-bold text-blue-600 hover:cursor-pointer">PostPay</div>

        {/* Navigation Links and Logout Button */}
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-4 text-sm font-medium text-gray-700">
            {user?.role === "Admin" && (
              <li>
                <Link
                  to="/admin-dash"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
              {user?.role === "Admin" && (
              <li>
                <Link
                  to="/users"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Manage Users
                </Link>
              </li>
            )}
            {user?.role === "User" && (
              <li>
                <Link
                  to="/user-dash"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  User Dashboard
                </Link>
              </li>
            )}
            {user?.role === "Account" && (
              <li>
                <Link
                  to="/account-dash"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Account Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Logout Button */}
          <button
            onClick={() => {
              dispatch(logoutUser());
              navigate("/auth/user-login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200 text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20 px-4 md:px-10 max-w-screen-xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

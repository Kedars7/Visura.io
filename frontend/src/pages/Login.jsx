import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import logoImg from "../assets/visura-logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      const { data } = await axios.post(
        API_ENDPOINTS.LOGIN,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message || "User logged in successfully");

      setEmail("");
      setPassword("");

      navigateTo("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Server error";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center p-4 sm:p-6">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <img
                          src={logoImg}
                          alt="Visura Logo"
                          className="h-6 sm:h-7"
                        />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-400 px-2">
            Sign in to continue creating amazing thumbnails
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#161B22] rounded-xl sm:rounded-2xl border border-gray-800 p-5 sm:p-6 md:p-8 backdrop-blur-sm">
          {/* Input Fields */}
          <div className="space-y-3 sm:space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#0D1117] border border-gray-800 rounded-lg sm:rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-[#0D1117] border border-gray-800 rounded-lg sm:rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#0D1117] border-gray-800 rounded accent-purple-500"
                />
                <span className="text-gray-400">Remember me</span>
              </label>
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6"
            >
              Sign In
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Toggle to Signup */}
        <div className="text-center mt-4 sm:mt-6">
          <span className="text-sm sm:text-base text-gray-400">Don't have an account?</span>{" "}
          <Link
            to="/signup"
            className="text-sm sm:text-base text-purple-400 font-semibold hover:text-purple-300 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

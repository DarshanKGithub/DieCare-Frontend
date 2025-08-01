"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }
      if (!process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        throw new Error("Admin email is not configured");
      }

      console.log("Attempting login with email:", data.email);

      const isAdmin = data.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const endpoint = isAdmin
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

      console.log("Calling endpoint:", endpoint);

      const response = await axios.post(endpoint, {
        email: data.email,
        password: data.password,
      });

      console.log("API Response:", response.data);

      const { token } = response.data;
      if (!token) {
        throw new Error("No token received from server");
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
      console.log("Decoded token role:", role);

      if (!role) {
        throw new Error("Role not found in token");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setLoginComplete(true);
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have logged in successfully! Redirecting...",
        confirmButtonColor: "#1e40af",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        timer: 5000, // Show for 5 seconds
        timerProgressBar: true,
      });
      // Redirect after alert closes
      if (role === "admin") {
        router.push("/adminDashboard");
      } else if (role === "hod") {
        router.push("/HODDashboard");
      } else if (role === "employee") {
        router.push("/employeeDashboard");
      } else if (role === "quality") {
        router.push("/qualityDashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred",
        confirmButtonColor: "#1e40af",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4 py-12 relative">
      <div className="flex flex-col md:flex-row bg-white/90 shadow-2xl rounded-2xl overflow-hidden max-w-6xl w-full h-[85vh] border border-gray-200 z-10">
        <div className="md:w-1/2 bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700 flex flex-col justify-center p-10 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath fill=%22none%22 stroke=%22%23ffffff33%22 stroke-width=%221%22 d=%22M10 10 L90 90 M10 90 L90 10%22/%3E%3C/svg%3E')] opacity-10"></div>
          <h1 className="text-white text-4xl font-bold text-center mb-4 drop-shadow-lg">
            DieCare Portal
          </h1>
          <p className="text-white text-center text-lg font-medium">
            Innovative Engineering Solutions
          </p>
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-2 bg-blue-600/50 rounded-full text-white text-sm font-semibold animate-pulse">
              Powered by Precision
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Secure Login
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <input
                placeholder="Email Address"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"
              } transition duration-300 transform hover:scale-105`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            © 2025 DieCare Engineering IT Department. All rights reserved.
          </p>
        </div>
      </div>

      {loginComplete && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <p className="text-white text-lg font-semibold animate-pulse">
            Redirecting to Dashboard...
          </p>
        </div>
      )}
    </div>
  );
}

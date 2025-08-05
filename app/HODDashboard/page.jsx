"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import axios from "axios";

// Mock data for notifications
const mockNotifications = [
  {
    id: "N001",
    message: "Task T001 assigned",
    recipients: ["employee"],
    taskId: "T001",
    date: new Date().toISOString(),
  },
];

export default function HODDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationCount, setNotificationCount] = useState(
    mockNotifications.length
  );
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userRole = localStorage.getItem("role") || "hod";
    setToken(storedToken);
    setRole(userRole);

    if (!storedToken || userRole !== "hod") {
      console.log("No token or incorrect role, redirecting to login");
      router.push("/");
      return;
    }

    // In your fetchNotifications function, replace the error handling part:
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        setNotifications(response.data);
        setNotificationCount(response.data.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications(mockNotifications); // Fallback to mock data
        setNotificationCount(mockNotifications.length);
        // Removed the Swal.fire error notification
      }
    };
    fetchNotifications();
  }, [router]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Are you sure you want to Logout?",
      showCancelButton: true,
      confirmButtonColor: "#1e40af",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        await Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully!",
          confirmButtonColor: "#1e40af",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/");
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: "An error occurred during logout.",
          confirmButtonColor: "#1e40af",
        });
      }
    }
  };

  const toggleNotificationDropdown = (e) => {
    e.stopPropagation(); // Prevent this click from triggering the outside click handler
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      <nav className="bg-gray-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-bold">DieCare</h1>
            </div>
            <div className="flex justify-center">
              <span className="text-white text-2xl font-bold">HOD Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleNotificationDropdown}
                  className="focus:outline-none"
                >
                  <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-300 transition duration-200" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotificationDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Notifications
                        </h3>
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setShowNotificationDropdown(false);
                              // You can add navigation logic here if needed
                            }}
                          >
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.date).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-sm text-gray-500">
                          No new notifications
                        </div>
                      )}
                      <div
                        className="px-4 py-2 bg-gray-50 text-center text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => {
                          router.push("/HODDashboard/hodNotificationPage");
                          setShowNotificationDropdown(false);
                        }}
                      >
                        View all notifications
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-gray-200 mb-8">
          Welcome to the HOD Dashboard. Monitor department activities, manage
          tasks, parts, and notifications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">
              Department Overview
            </h2>
            <p className="text-gray-600 mt-2">
              Monitor your department's performance metrics.
            </p>
            <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300">
              View Metrics
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">
              Task Management
            </h2>
            <p className="text-gray-600 mt-2">
              View and manage all department tasks.
            </p>
            <button
              onClick={() => router.push("/HODDashboard/hodTaskPage")}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
            >
              View Tasks
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">
              Parts Inventory
            </h2>
            <p className="text-gray-600 mt-2">
              View and manage all parts in inventory.
            </p>
            <button
              onClick={() => router.push("/HODDashboard/hodPartsPage")}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
            >
              View Parts
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-gray-600 mt-2">
              View all department notifications.
            </p>
            <button
              onClick={() => router.push("/HODDashboard/hodNotificationPage")}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
            >
              View Notifications
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
            <p className="text-gray-600 mt-2">
              Generate and view department reports.
            </p>
            <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300">
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import axios from "axios";

// Mock data to replace Redux store
const mockParts = [
  {
    serial_number: "P001",
    part_name: "Gearbox",
    company_name: "Acme Corp",
    sap_code: "SAP123",
    location: "Warehouse A",
  },
  {
    serial_number: "P002",
    part_name: "Shaft",
    company_name: "Beta Inc",
    sap_code: "SAP456",
    location: "Warehouse B",
  },
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    partName: "",
    companyName: "",
    sapCode: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [parts, setParts] = useState(mockParts);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userRole = localStorage.getItem("role") || "employee";
    setToken(storedToken);
    setRole(userRole);

    if (!storedToken || userRole !== "employee") {
      console.log("No token or incorrect role, redirecting to login");
      router.push("/");
      return;
    }

    // Fetch parts from API
    const fetchParts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/parts`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setParts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parts:", error);
        setParts(mockParts); // Fallback to mock data
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to fetch parts",
          confirmButtonColor: "#1e40af",
        });
      }
    };
    fetchParts();
    setNotifications(0); // Set to mock notification count if needed
  }, [router]);

  const partToDetailsMap = parts.reduce((map, part) => {
    map[part.part_name.toLowerCase()] = {
      companyName: part.company_name,
      sapCode: part.sap_code,
      location: part.location,
    };
    return map;
  }, {});
  const partNames = [...new Set(parts.map((part) => part.part_name))];

  const handlePartNameChange = (e) => {
    const partName = e.target.value;
    const partDetails = partToDetailsMap[partName.toLowerCase()] || {};
    setFormData({
      partName,
      companyName: partDetails.companyName || "",
      sapCode: partDetails.sapCode || "",
      location: partDetails.location || "",
    });
    setErrors({
      ...errors,
      partName: "",
      companyName: "",
      sapCode: "",
      location: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.partName) newErrors.partName = "Part name is required";
    if (!formData.companyName)
      newErrors.companyName = "Company name is required";
    if (!formData.sapCode) newErrors.sapCode = "SAP code is required";
    if (!formData.location) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      // Add part via API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parts`,
        {
          partName: formData.partName,
          companyName: formData.companyName,
          sapCode: formData.sapCode,
          location: formData.location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setParts([...parts, response.data.part]);

      // Fallback to mock data addition if API is not used
      const newPart = {
        serial_number: `P${(parts.length + 1).toString().padStart(3, "0")}`,
        part_name: formData.partName,
        company_name: formData.companyName,
        sap_code: formData.sapCode,
        location: formData.location,
      };
      setParts([...parts, newPart]);

      await Swal.fire({
        icon: "success",
        title: "Part Added",
        text: `Part added successfully with Serial Number: ${newPart.serial_number}`,
        confirmButtonColor: "#1e40af",
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({ partName: "", companyName: "", sapCode: "", location: "" });
      setIsFormOpen(false);
      setErrors({});
    } catch (error) {
      console.error("Error adding part:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add part",
        confirmButtonColor: "#1e40af",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      <nav className="bg-gray-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-bold">DieCare</h1>
            </div>
            <div className="flex justify-center">
              <span className="text-white text-2xl font-bold">
                Admin Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-300 transition duration-200" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications}
                  </span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <p className="text-lg text-gray-200 mb-8">
          Welcome to the Employee Dashboard. Manage your tasks, view performance
          metrics, and update your profile.
        </p>

        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-green-700 hover:bg-green-800 text-white p-4 rounded-full shadow-lg transition duration-300"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
          {isMenuOpen && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-4 w-48">
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition duration-200"
              >
                Add Part
              </button>
            </div>
          )}
        </div>

        {/* Dimmed background when form is open */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
            isFormOpen ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">
              Parts Management
            </h2>
            <p className="text-gray-600 mt-2">
              Add and manage parts inventory.
            </p>
            <button
              onClick={() => router.push("/partsPage")}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
            >
              View Parts
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <p className="text-gray-600 mt-2">
              View and manage your assigned tasks.
            </p>
            <button
              onClick={() => router.push("/employeeDashboard/employeeTaskPage")}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
            >
              View Tasks
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <p className="text-gray-600 mt-2">
              Update your personal and professional details.
            </p>
            <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Small popup form */}
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Part
                </h2>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({
                      partName: "",
                      companyName: "",
                      sapCode: "",
                      location: "",
                    });
                    setErrors({});
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="partName"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Part Name
                  </label>
                  <select
                    name="partName"
                    id="partName"
                    value={formData.partName}
                    onChange={handlePartNameChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    disabled={loading}
                  >
                    <option value="" disabled>
                      Select a part
                    </option>
                    {partNames.map((part) => (
                      <option key={part} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                  {errors.partName && (
                    <p className="text-sm text-red-600">{errors.partName}</p>
                  )}
                  {loading && (
                    <p className="text-sm text-gray-600">Loading parts...</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="companyName"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="sapCode"
                    className="text-sm font-semibold text-gray-700"
                  >
                    SAP Code
                  </label>
                  <input
                    type="text"
                    name="sapCode"
                    id="sapCode"
                    value={formData.sapCode}
                    onChange={(e) =>
                      setFormData({ ...formData, sapCode: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    placeholder="Enter SAP code"
                  />
                  {errors.sapCode && (
                    <p className="text-sm text-red-600">{errors.sapCode}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="location"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    placeholder="Enter location"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormData({
                        partName: "",
                        companyName: "",
                        sapCode: "",
                        location: "",
                      });
                      setErrors({});
                    }}
                    className="py-2 px-4 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

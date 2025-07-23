'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    partName: '',
    companyName: '',
  });
  const [errors, setErrors] = useState({});
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/');
      return;
    }

    // Fetch parts from API
    const fetchParts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/parts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parts:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to fetch parts',
          confirmButtonColor: '#1e40af',
        });
        setLoading(false);
      }
    };

    fetchParts();
  }, [router]);

  // Create part-to-company mapping from fetched parts
  const partToCompanyMap = parts.reduce((map, part) => {
    map[part.part_name.toLowerCase()] = part.company_name;
    return map;
  }, {});
  const partNames = [...new Set(parts.map(part => part.part_name))]; // Unique part names

  const handlePartNameChange = (e) => {
    const partName = e.target.value;
    const companyName = partToCompanyMap[partName.toLowerCase()] || '';
    setFormData({ partName, companyName });
    setErrors({ ...errors, partName: '', companyName: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.partName) newErrors.partName = 'Part name is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parts`,
        { partName: formData.partName, companyName: formData.companyName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await Swal.fire({
        icon: 'success',
        title: 'Part Added',
        text: `Part added successfully with Serial Number: ${response.data.part.serial_number}`,
        confirmButtonColor: '#1e40af',
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh parts list after adding a new part
      const updatedParts = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/parts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParts(updatedParts.data);

      setFormData({ partName: '', companyName: '' });
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding part:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add part',
        confirmButtonColor: '#1e40af',
      });
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Are you sure?',
      text: 'Do you want to log out?',
      showCancelButton: true,
      confirmButtonColor: '#1e40af',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        localStorage.removeItem('token');
        await Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully!',
          confirmButtonColor: '#1e40af',
          timer: 1500,
          showConfirmButton: false,
        });
        router.push('/');
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'An error occurred during logout.',
          confirmButtonColor: '#1e40af',
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
              <h1 className="text-white text-2xl font-bold">DieCare Portal</h1>
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
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Part</span>
              </button>
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
        <h1 className="text-3xl font-bold text-white mb-6">Employee Dashboard</h1>
        <p className="text-lg text-gray-200 mb-8">
          Welcome to the Employee Dashboard. Manage your tasks, view performance metrics, and update your profile.
        </p>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add New Part</h2>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({ partName: '', companyName: '' });
                    setErrors({});
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="partName" className="text-sm font-semibold text-gray-700">Part Name</label>
                  <select
                    name="partName"
                    id="partName"
                    value={formData.partName}
                    onChange={handlePartNameChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    disabled={loading}
                  >
                    <option value="" disabled>Select a part</option>
                    {partNames.map((part) => (
                      <option key={part} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                  {errors.partName && <p className="text-sm text-red-600">{errors.partName}</p>}
                  {loading && <p className="text-sm text-gray-600">Loading parts...</p>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="companyName" className="text-sm font-semibold text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    placeholder="Company name will auto-populate"
                  />
                  {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormData({ partName: '', companyName: '' });
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
            <p className="text-gray-600 mt-2">View and manage your assigned tasks.</p>
            <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300">
              View Tasks
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
            <p className="text-gray-600 mt-2">Track your performance and productivity.</p>
            <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300">
              View Metrics
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <p className="text-gray-600 mt-2">Update your personal and professional details.</p>
            <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
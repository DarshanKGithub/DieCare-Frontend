'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(0); // Placeholder for notification count

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
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
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
          text: error.response?.data?.message || 'An error occurred during logout.',
          confirmButtonColor: '#1e40af',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      {/* Navigation Bar */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Employee Dashboard</h1>
        <p className="text-lg text-gray-200 mb-8">
          Welcome to the Employee Dashboard. Manage your tasks, view performance metrics, and update your profile.
        </p>
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
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function HODDashboard() {
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
        <h1 className="text-3xl font-bold text-white mb-6">HOD Dashboard</h1>
        <p className="text-lg text-gray-200 mb-8">
          Welcome to the HOD Dashboard. Here you can manage your department's activities.
        </p>
        {/* Add more components or features as needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Department Overview</h2>
            <p className="text-gray-600 mt-2">Monitor your department's performance metrics.</p>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
            <p className="text-gray-600 mt-2">Assign and track tasks for your team.</p>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
            <p className="text-gray-600 mt-2">Generate and view department reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
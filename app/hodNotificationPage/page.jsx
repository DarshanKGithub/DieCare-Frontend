'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';

// Mock data for notifications
const mockNotifications = [
  { id: 'N001', message: 'Task T001 assigned', recipients: ['employee'], taskId: 'T001' },
];

export default function HODNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('role') || 'hod';
    setToken(storedToken);
    setRole(userRole);

    if (!storedToken || userRole !== 'hod') {
      console.log('No token or incorrect role, redirecting to login');
      router.push('/');
      return;
    }

    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setNotifications(response.data);
        setNotificationsLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications(mockNotifications); // Fallback to mock data
        setNotificationsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to fetch notifications',
          confirmButtonColor: '#1e40af',
        });
      }
    };
    fetchNotifications();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      <nav className="bg-gray-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-bold">DieCare Portal - Notifications</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/hod')}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Department Notifications</h1>
        <div className="bg-white/90 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification List</h2>
          {notificationsLoading ? (
            <p className="text-gray-600">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-600">No notifications available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notification ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notification.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{notification.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notification.recipients.join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notification.taskId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
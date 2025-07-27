'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';

// Mock data for tasks
const mockTasks = [
  { id: 'T001', part_name: 'Gearbox', description: 'Inspect gearbox', status: 'pending' },
];

export default function HODTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState(mockTasks);
  const [tasksLoading, setTasksLoading] = useState(false);
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

    // Fetch tasks from API
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setTasks(response.data);
        setTasksLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks(mockTasks); // Fallback to mock data
        setTasksLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to fetch tasks',
          confirmButtonColor: '#1e40af',
        });
      }
    };
    fetchTasks();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      <nav className="bg-gray-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-bold">DieCare Portal - Tasks</h1>
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
        <h1 className="text-3xl font-bold text-white mb-6">Department Tasks</h1>
        <div className="bg-white/90 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Task List</h2>
          {tasksLoading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-600">No tasks available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.part_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{task.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
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
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';

// Mock data for tasks and notifications
const mockTasks = [
  { id: 'T001', part_name: 'Gearbox', description: 'Inspect gearbox', status: 'pending' },
];

const mockNotifications = [
  { id: 'N001', message: 'Task T001 assigned', recipients: ['employee'], taskId: 'T001' },
];

export default function QualityDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState(mockTasks);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [parts, setParts] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isNotificationFormOpen, setIsNotificationFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    partName: '',
    companyName: '',
    sapCode: '',
    description: '',
    location: '',
    status: 'pending',
    createdBy: 'quality',
  });
  const [notificationFormData, setNotificationFormData] = useState({
    message: '',
    recipients: [],
    taskId: '',
  });
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [notificationCount, setNotificationCount] = useState(notifications.length);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [partsLoading, setPartsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('role') || 'quality';
    setToken(storedToken);
    setRole(userRole);

    if (!storedToken || userRole !== 'quality') {
      console.log('No token or incorrect role, redirecting to login');
      router.push('/');
      return;
    }

    const fetchParts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/parts`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setParts(response.data);
        setPartsLoading(false);
      } catch (error) {
        console.error('Error fetching parts:', error);
        setPartsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch parts',
          confirmButtonColor: '#1e40af',
        });
      }
    };

    fetchParts();
    setTasks(mockTasks);
    setNotifications(mockNotifications);
    setNotificationCount(mockNotifications.length);
    setTasksLoading(false);
    setNotificationsLoading(false);
  }, [router]);

  const partToDetailsMap = parts.reduce((map, part) => {
    map[part.part_name] = {
      companyName: part.company_name,
      sapCode: part.sap_code,
    };
    return map;
  }, {});
  const partNames = [...new Set(parts.map((part) => part.part_name))];

  const handleTaskPartChange = (e) => {
    const partName = e.target.value;
    const partDetails = partToDetailsMap[partName] || {};
    setTaskFormData({
      ...taskFormData,
      partName,
      companyName: partDetails.companyName || '',
      sapCode: partDetails.sapCode || '',
    });
    setErrors({ ...errors, partName: '', companyName: '', sapCode: '' });
  };

  const validateTaskForm = () => {
    const newErrors = {};
    if (!taskFormData.partName) newErrors.partName = 'Part name is required';
    if (!taskFormData.companyName) newErrors.companyName = 'Company name is required';
    if (!taskFormData.sapCode) newErrors.sapCode = 'SAP code is required';
    if (!taskFormData.description) newErrors.description = 'Description is required';
    if (!taskFormData.location) newErrors.location = 'Location is required';
    if (!taskFormData.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const validateNotificationForm = () => {
    const newErrors = {};
    if (!notificationFormData.message) newErrors.message = 'Message is required';
    if (!notificationFormData.taskId) newErrors.taskId = 'Task ID is required';
    if (!notificationFormData.recipients || notificationFormData.recipients.length === 0)
      newErrors.recipients = 'At least one recipient is required';
    return newErrors;
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateTaskForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setTasksLoading(true);
      const newTask = {
        id: `T${(tasks.length + 1).toString().padStart(3, '0')}`,
        part_name: taskFormData.partName,
        description: taskFormData.description,
        status: taskFormData.status,
      };
      setTasks([...tasks, newTask]);

      const newNotification = {
        id: `N${(notifications.length + 1).toString().padStart(3, '0')}`,
        message: `New task ${newTask.id} assigned: ${taskFormData.description}`,
        recipients: ['employee', 'hod'],
        taskId: newTask.id,
      };
      setNotifications([...notifications, newNotification]);
      setNotificationCount(notifications.length + 1);

      await Swal.fire({
        icon: 'success',
        title: 'Task Created',
        text: 'Task created and notifications sent to Employee and HOD!',
        confirmButtonColor: '#1e40af',
        timer: 1500,
        showConfirmButton: false,
      });
      setTaskFormData({
        partName: '',
        companyName: '',
        sapCode: '',
        description: '',
        location: '',
        status: 'pending',
        createdBy: 'quality',
      });
      setIsTaskFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create task',
        confirmButtonColor: '#1e40af',
      });
    } finally {
      setTasksLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateNotificationForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setNotificationsLoading(true);
      const newNotification = {
        id: `N${(notifications.length + 1).toString().padStart(3, '0')}`,
        message: notificationFormData.message,
        recipients: notificationFormData.recipients,
        taskId: notificationFormData.taskId,
      };
      setNotifications([...notifications, newNotification]);
      setNotificationCount(notifications.length + 1);

      await Swal.fire({
        icon: 'success',
        title: 'Notification Sent',
        text: 'Notification sent successfully!',
        confirmButtonColor: '#1e40af',
        timer: 1500,
        showConfirmButton: false,
      });
      setNotificationFormData({ message: '', recipients: [], taskId: '' });
      setIsNotificationFormOpen(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to send notification',
        confirmButtonColor: '#1e40af',
      });
    } finally {
      setNotificationsLoading(false);
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
        localStorage.removeItem('role');
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
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Quality Dashboard</h1>
        </div>
        <p className="text-lg text-gray-200 mb-8">
          Welcome to the Quality Dashboard. Create tasks, send notifications, and manage quality control.
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
                  setIsTaskFormOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition duration-200"
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setIsNotificationFormOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition duration-200"
              >
                Send Notification
              </button>
            </div>
          )}
        </div>
        {isTaskFormOpen && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                <button
                  onClick={() => {
                    setIsTaskFormOpen(false);
                    setTaskFormData({
                      partName: '',
                      companyName: '',
                      sapCode: '',
                      description: '',
                      location: '',
                      status: 'pending',
                      createdBy: 'quality',
                    });
                    setErrors({});
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div className="flex flex-row flex-wrap gap-4">
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <label htmlFor="partName" className="text-sm font-semibold text-gray-700">Part Name</label>
                    <select
                      name="partName"
                      id="partName"
                      value={taskFormData.partName}
                      onChange={handleTaskPartChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                      disabled={partsLoading}
                    >
                      <option value="" disabled>Select a part</option>
                      {partNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    {errors.partName && <p className="text-sm text-red-600">{errors.partName}</p>}
                    {partsLoading && <p className="text-sm text-gray-600">Loading parts...</p>}
                  </div>
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <label htmlFor="companyName" className="text-sm font-semibold text-gray-700">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={taskFormData.companyName}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      placeholder="Company name will auto-populate"
                    />
                    {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                  </div>
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <label htmlFor="sapCode" className="text-sm font-semibold text-gray-700">SAP Code</label>
                    <input
                      type="text"
                      name="sapCode"
                      id="sapCode"
                      value={taskFormData.sapCode}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      placeholder="SAP code will auto-populate"
                    />
                    {errors.sapCode && <p className="text-sm text-red-600">{errors.sapCode}</p>}
                  </div>
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <label htmlFor="location" className="text-sm font-semibold text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={taskFormData.location}
                      onChange={(e) => setTaskFormData({ ...taskFormData, location: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                      placeholder="Enter location"
                    />
                    {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                  </div>
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</label>
                    <select
                      name="status"
                      id="status"
                      value={taskFormData.status}
                      onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    placeholder="Enter task description"
                  />
                  {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTaskFormOpen(false);
                      setTaskFormData({
                        partName: '',
                        companyName: '',
                        sapCode: '',
                        description: '',
                        location: '',
                        status: 'pending',
                        createdBy: 'quality',
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
                    disabled={tasksLoading}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isNotificationFormOpen && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
                <button
                  onClick={() => {
                    setIsNotificationFormOpen(false);
                    setNotificationFormData({ message: '', recipients: [], taskId: '' });
                    setErrors({});
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="taskId" className="text-sm font-semibold text-gray-700">Task ID</label>
                  <select
                    name="taskId"
                    id="taskId"
                    value={notificationFormData.taskId}
                    onChange={(e) => setNotificationFormData({ ...notificationFormData, taskId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    disabled={tasksLoading}
                  >
                    <option value="" disabled>Select a task</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.id} - {task.part_name}
                      </option>
                    ))}
                  </select>
                  {errors.taskId && <p className="text-sm text-red-600">{errors.taskId}</p>}
                  {tasksLoading && <p className="text-sm text-gray-600">Loading tasks...</p>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    value={notificationFormData.message}
                    onChange={(e) => setNotificationFormData({ ...notificationFormData, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                    placeholder="Enter notification message"
                  />
                  {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Recipients</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="employee"
                        checked={notificationFormData.recipients.includes('employee')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNotificationFormData({
                            ...notificationFormData,
                            recipients: notificationFormData.recipients.includes(value)
                              ? notificationFormData.recipients.filter((r) => r !== value)
                              : [...notificationFormData.recipients, value],
                          });
                        }}
                        className="mr-2"
                      />
                      Employee
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="hod"
                        checked={notificationFormData.recipients.includes('hod')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNotificationFormData({
                            ...notificationFormData,
                            recipients: notificationFormData.recipients.includes(value)
                              ? notificationFormData.recipients.filter((r) => r !== value)
                              : [...notificationFormData.recipients, value],
                          });
                        }}
                        className="mr-2"
                      />
                      HOD
                    </label>
                  </div>
                  {errors.recipients && <p className="text-sm text-red-600">{errors.recipients}</p>}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationFormOpen(false);
                      setNotificationFormData({ message: '', recipients: [], taskId: '' });
                      setErrors({});
                    }}
                    className="py-2 px-4 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
                    disabled={notificationsLoading}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
            <p className="text-gray-600 mt-2">View and manage your created tasks.</p>
            <button
              onClick={() => router.push('/taskPage')}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
            >
              View Tasks
            </button>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <p className="text-gray-600 mt-2">Send and track notifications.</p>
            <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300">
              View Notifications
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
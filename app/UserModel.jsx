'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function UserModal({ isOpen, onClose, onSave, user, mode, role }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    department_name: '',
    designation: '',
    password: '',
    role: role || 'hod', // Default to the passed role
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number || '',
        department_name: user.department_name || '',
        designation: user.designation || '',
        password: '', // Password not pre-filled for security
        role: user.role,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        contact_number: '',
        department_name: '',
        designation: '',
        password: '',
        role: role || 'hod',
      });
    }
  }, [user, mode, isOpen, role]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white/90 shadow-2xl rounded-2xl w-full max-w-3xl h-[80vh] transform transition-all duration-300 scale-100">
        {/* Left Side: Mechanical Theme */}
        <div className="w-1/3 bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700 flex flex-col justify-center p-6 relative rounded-l-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath fill=%22none%22 stroke=%22%23ffffff33%22 stroke-width=%221%22 d=%22M10 10 L90 90 M10 90 L90 10%22/%3E%3C/svg%3E')] opacity-10"></div>
          <h3 className="text-3xl font-bold text-white text-center drop-shadow-lg">
            {mode === 'edit' ? 'Edit User' : `Add New ${role === 'hod' ? 'HOD' : 'Employee'}`}
          </h3>
          <p className="text-white text-center text-lg font-medium mt-2">Precision Engineering Portal</p>
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 bg-blue-600/50 rounded-full text-white text-sm font-semibold animate-pulse">
              Powered by Innovation
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-blue-200 p-2 rounded-full transition duration-200 hover:bg-blue-900"
          >
            <FaTimes size={20} />
          </button>
        </div>
        {/* Right Side: Form */}
        <div className="w-2/3 p-8 flex flex-col justify-center bg-gray-50 rounded-r-2xl">
          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto h-[70vh]">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter full name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter email address"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="contact_number" className="block text-sm font-semibold text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                id="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter contact number"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="department_name" className="block text-sm font-semibold text-gray-700">Department</label>
              <input
                type="text"
                name="department_name"
                id="department_name"
                value={formData.department_name}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter department"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="designation" className="block text-sm font-semibold text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                id="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter designation"
              />
            </div>
            {mode === 'add' && (
              <div className="flex flex-col space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                  placeholder="Enter password"
                />
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700">Role</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              >
                <option value="hod">HOD</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-6 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 px-6 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition duration-300 transform hover:scale-105"
              >
                {mode === 'edit' ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
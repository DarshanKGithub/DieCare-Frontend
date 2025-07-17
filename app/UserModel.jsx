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
      <div className="bg-white/90 shadow-2xl rounded-2xl w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit User' : `Add New ${role === 'hod' ? 'HOD' : 'Employee'}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              id="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="department_name" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department_name"
              id="department_name"
              value={formData.department_name}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              id="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
            />
          </div>
          {mode === 'add' && (
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              />
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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
          <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition duration-300 transform hover:scale-105"
            >
              {mode === 'edit' ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
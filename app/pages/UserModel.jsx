'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function UserModal({ isOpen, onClose, onSave, user, mode, role }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    department_name: '',
    designation: '',
    password: '',
    role: role || 'hod',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number || '',
        department_name: user.department_name || '',
        designation: user.designation || '',
        password: '',
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
    setErrors({});
  }, [user, mode, isOpen, role]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.department_name) newErrors.department_name = 'Department is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (mode === 'add' && !formData.password) newErrors.password = 'Password is required';
    if (!['hod', 'employee'].includes(formData.role)) newErrors.role = 'Invalid role';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/3 w-full bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700 p-6 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath fill=%22none%22 stroke=%22%23ffffff33%22 stroke-width=%221%22 d=%22M10 10 L90 90 M10 90 L90 10%22/%3E%3C/svg%3E')] opacity-10"></div>
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center drop-shadow-lg">
            {mode === 'edit' ? 'Edit User' : `Add New ${role === 'hod' ? 'HOD' : 'Employee'}`}
          </h3>
          <p className="text-white text-center text-base md:text-lg font-medium mt-2">Precision Engineering Portal</p>
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 bg-blue-600/50 rounded-full text-white text-sm font-semibold">
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
        <div className="md:w-2/3 w-full p-4 md:p-6 bg-gray-50 flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] md:max-h-[80vh] pr-2">
            <div className="flex flex-col space-y-1">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="contact_number" className="text-sm font-semibold text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                id="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter contact number"
              />
              {errors.contact_number && <p className="text-sm text-red-600">{errors.contact_number}</p>}
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="department_name" className="text-sm font-semibold text-gray-700">Department</label>
              <input
                type="text"
                name="department_name"
                id="department_name"
                value={formData.department_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter department"
              />
              {errors.department_name && <p className="text-sm text-red-600">{errors.department_name}</p>}
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="designation" className="text-sm font-semibold text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                id="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="Enter designation"
              />
              {errors.designation && <p className="text-sm text-red-600">{errors.designation}</p>}
            </div>
            {mode === 'add' && (
              <div className="flex flex-col space-y-1">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
オス
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
            )}
            <div className="flex flex-col space-y-1">
              <label htmlFor="role" className="text-sm font-semibold text-gray-700">Role</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              >
                <option value="hod">HOD</option>
                <option value="employee">Employee</option>
              </select>
              {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
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
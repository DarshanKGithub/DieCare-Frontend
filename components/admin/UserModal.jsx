"use client";
import React, { useState, useEffect } from "react";
import { User, Mail, KeyRound, Phone, Briefcase, UserCheck } from "lucide-react";
import { apiService } from "../../services/api";
import { Input, Select, Button, Alert } from "../ui";

export const UserModal = ({ user, onClose, onSave, token }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "Employee",
    designation: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});

  // Initialize form with user data when editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        role: user.role || "Employee",
        designation: user.designation || "",
        password: "",
        confirm_password: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    console.log(`Updating ${e.target.name}: ${e.target.value}`); // Debug input changes
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, role, password, confirm_password, phone_number } = formData; // Destructure all needed fields

    if (!name.trim()) newErrors.name = "Full Name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email address.";
    if (!role) newErrors.role = "Role is required.";
    if (!user) {
      if (!password || password.length < 6)
        newErrors.password = "Password must be at least 6 characters long.";
      if (password !== confirm_password)
        newErrors.confirm_password = "Passwords do not match.";
    }
    if (phone_number && !/^\+91[1-9]\d{9}$/.test(phone_number))
      newErrors.phone_number = "Phone number must be in the format +91XXXXXXXXXX.";

    setErrors(newErrors);
    console.log("Validation errors:", newErrors); // Debug validation errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: "", message: "" });

    // Debug: Log the formData before submission
    console.log("Submitting formData:", formData);

    if (!validateForm()) {
      console.log("Validation failed with errors:", errors);
      return;
    }

    setLoading(true);
    let response;
    try {
      if (user) {
        // Edit user: Send only non-empty fields
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.phone_number && { phone_number: formData.phone_number }),
          ...(formData.designation && { designation: formData.designation }),
          ...(formData.password && { password: formData.password }),
        };
        response = await apiService.updateUser(user.id, updateData, token);
      } else {
        // Add new user: Send all required fields
        response = await apiService.register(formData);
      }
      setLoading(false);

      if (response.success) {
        setNotification({ type: "success", message: response.message });
        onSave();
        setTimeout(onClose, 2000);
      } else {
        setNotification({ type: "error", message: response.message || "Failed to save user" });
      }
    } catch (error) {
      setLoading(false);
      setNotification({ type: "error", message: error.message || "Unexpected error occurred" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-[500px] max-w-2xl p-8 space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <User size={48} className="mx-auto text-cyan-400" />
          <h1 className="text-3xl font-bold text-white mt-4">{user ? "Edit User" : "Add User"}</h1>
          <p className="text-gray-400">{user ? "Update user details" : "Create a new user account"}</p>
        </div>
        <Alert message={notification.message} type={notification.type} />
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <Input
              icon={<User size={20} />}
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1 ml-2">{errors.name}</p>}
          </div>
          <div>
            <Input
              icon={<Mail size={20} />}
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1 ml-2">{errors.email}</p>}
          </div>
          <div>
            <Input
              icon={<Phone size={20} />}
              type="tel"
              name="phone_number"
              placeholder="Phone Number (e.g., +919876543210)"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
            {errors.phone_number && (
              <p className="text-red-400 text-sm mt-1 ml-2">{errors.phone_number}</p>
            )}
          </div>
          <div>
            <Select
              icon={<UserCheck size={20} />}
              name="role"
              required
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="Employee">Employee</option>
              <option value="HOD">HOD</option>
              <option value="Quality">Quality</option>
              <option value="PDC">PDC</option>
              <option value="Admin">Admin</option>
            </Select>
            {errors.role && <p className="text-red-400 text-sm mt-1 ml-2">{errors.role}</p>}
          </div>
          <div>
            <Input
              icon={<Briefcase size={20} />}
              type="text"
              name="designation"
              placeholder="Designation (Optional)"
              value={formData.designation}
              onChange={handleInputChange}
            />
          </div>
          {!user && (
            <>
              <div>
                <Input
                  icon={<KeyRound size={20} />}
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1 ml-2">{errors.password}</p>
                )}
              </div>
              <div>
                <Input
                  icon={<KeyRound size={20} />}
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  required
                  minLength="6"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                />
                {errors.confirm_password && (
                  <p className="text-red-400 text-sm mt-1 ml-2">{errors.confirm_password}</p>
                )}
              </div>
            </>
          )}
          <div className="flex gap-2">
            <Button type="submit" isLoading={loading}>
              {user ? "Update User" : "Add User"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
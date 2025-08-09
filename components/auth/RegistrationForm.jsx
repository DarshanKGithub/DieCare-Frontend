 'use client';
import React, { useState } from 'react'; import { User, Mail, KeyRound, Phone, Briefcase, UserCheck } from 'lucide-react';
import { apiService } from '../../services/api';
import { Input, Select, Button, Alert } from '../ui';

export const RegistrationForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone_number: '', role: 'Employee',
        designation: '', password: '', confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const validateForm = () => {
        const newErrors = {};
        const { name, email, phone_number, password, confirm_password } = formData;
        
        if (!name.trim()) {
            newErrors.name = 'Full Name is required.';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (phone_number && !/^\+91[1-9]\d{9}$/.test(phone_number)) {
            newErrors.phone_number = 'Phone number must be in the format +91XXXXXXXXXX.';
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        if (password !== confirm_password) {
            newErrors.confirm_password = 'Passwords do not match.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ type: '', message: '' });

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        setLoading(true);
        const response = await apiService.register(formData);
        setLoading(false);
        setNotification({ type: response.success ? 'success' : 'error', message: response.message });

        if (response.success) {
            setTimeout(() => onSwitchToLogin(), 2000);
        }
    };

    return (
        <div className="w-[500px] max-w-2xl p-8 space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
            <div className="text-center">
                <User size={48} className="mx-auto text-cyan-400" />
                <h1 className="text-3xl font-bold text-white mt-4">Create Account</h1>
                <p className="text-gray-400">Join the platform to get started</p>
            </div>
            <Alert message={notification.message} type={notification.type} />
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <div>
                    <Input icon={<User size={20} />} type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} />
                    {errors.name && <p className="text-red-400 text-sm mt-1 ml-2">{errors.name}</p>}
                </div>
                <div>
                    <Input icon={<Mail size={20} />} type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} />
                    {errors.email && <p className="text-red-400 text-sm mt-1 ml-2">{errors.email}</p>}
                </div>
                <div>
                    <Input icon={<Phone size={20} />} type="tel" name="phone_number" placeholder="Phone Number (e.g., +919876543210)" value={formData.phone_number} onChange={handleInputChange} />
                    {errors.phone_number && <p className="text-red-400 text-sm mt-1 ml-2">{errors.phone_number}</p>}
                </div>
                <div>
                    <Select icon={<UserCheck size={20} />} name="role" required value={formData.role} onChange={handleInputChange}>
                        <option value="Employee">Employee</option>
                        <option value="HOD">HOD</option>
                        <option value="Quality">Quality</option>
                        <option value="Admin">Admin</option>
                    </Select>
                </div>
                <div>
                    <Input icon={<Briefcase size={20} />} type="text" name="designation" placeholder="Designation (Optional)" value={formData.designation} onChange={handleInputChange} />
                </div>
                <div>
                    <Input icon={<KeyRound size={20} />} type="password" name="password" placeholder="Password" required minLength="6" value={formData.password} onChange={handleInputChange} />
                    {errors.password && <p className="text-red-400 text-sm mt-1 ml-2">{errors.password}</p>}
                </div>
                <div>
                    <Input icon={<KeyRound size={20} />} type="password" name="confirm_password" placeholder="Confirm Password" required minLength="6" value={formData.confirm_password} onChange={handleInputChange} />
                    {errors.confirm_password && <p className="text-red-400 text-sm mt-1 ml-2">{errors.confirm_password}</p>}
                </div>
                <Button type="submit" isLoading={loading}>Register</Button>
            </form>
            <div className="text-center mt-6">
                <button onClick={onSwitchToLogin} className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
};

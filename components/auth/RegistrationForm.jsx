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

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const validateForm = () => {
        const { name, email, phone_number, password, confirm_password } = formData;
        
        if (!name.trim()) {
            setNotification({ type: 'error', message: 'Full Name is required.' });
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setNotification({ type: 'error', message: 'Please enter a valid email address.' });
            return false;
        }

        // Validate phone number only if it's not empty
        if (phone_number && !/^\+91[1-9]\d{9}$/.test(phone_number)) {
            setNotification({ type: 'error', message: 'Phone number must be in the format +91XXXXXXXXXX.' });
            return false;
        }

        if (password.length < 6) {
            setNotification({ type: 'error', message: 'Password must be at least 6 characters long.' });
            return false;
        }

        if (password !== confirm_password) {
            setNotification({ type: 'error', message: 'Passwords do not match.' });
            return false;
        }
        
        return true;
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
        <div className="w-[500px] max-w-xl p-8 space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
            <div className="text-center">
                <User size={48} className="mx-auto text-cyan-400" />
                <h1 className="text-3xl font-bold text-white mt-4">Create Account</h1>
                <p className="text-gray-400">Join the platform to get started</p>
            </div>
            <Alert message={notification.message} type={notification.type} />
            <form className="space-y-5" onSubmit={handleSubmit}>
                <Input icon={<User size={20} />} type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} />
                <Input icon={<Mail size={20} />} type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} />
                <Input icon={<Phone size={20} />} type="tel" name="phone_number" placeholder="Phone Number (e.g., +919876543210)" value={formData.phone_number} onChange={handleInputChange} />
                <Select icon={<UserCheck size={20} />} name="role" required value={formData.role} onChange={handleInputChange}>
                    <option value="Employee">Employee</option>
                    <option value="HOD">HOD</option>
                    <option value="Quality">Quality</option>
                    <option value="Admin">Admin</option>
                </Select>
                <Input icon={<Briefcase size={20} />} type="text" name="designation" placeholder="Designation (Optional)" value={formData.designation} onChange={handleInputChange} />
                <Input icon={<KeyRound size={20} />} type="password" name="password" placeholder="Password" required minLength="6" value={formData.password} onChange={handleInputChange} />
                <Input icon={<KeyRound size={20} />} type="password" name="confirm_password" placeholder="Confirm Password" required minLength="6" value={formData.confirm_password} onChange={handleInputChange} />
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


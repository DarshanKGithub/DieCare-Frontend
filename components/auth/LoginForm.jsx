'use client'; // Add this directive for Next.js App Router

import React, { useState } from 'react';
import { Shield, Mail, KeyRound } from 'lucide-react';
 import { apiService } from '../../services/api'; 
import { Input, Button, Alert } from '../ui';

// ============================================================================
// --- Login Form Component ---
// FILE: /components/auth/LoginForm.jsx
// NOTE: Add 'export' to the component definition.
// ============================================================================
export const LoginForm = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const validateForm = () => {
        const { email, password } = formData;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            setNotification({ type: 'error', message: 'Please enter a valid email address.' });
            return false;
        }

        if (!password) {
            setNotification({ type: 'error', message: 'Password is required.' });
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
        const response = await apiService.login(formData.email, formData.password);
        setLoading(false);
        
        setNotification({ type: response.success ? 'success' : 'error', message: response.message });

        if (response.success) {
            console.log("Logged in successfully!");
            // Here you would typically save the token and redirect the user
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
            <div className="text-center">
                <Shield size={48} className="mx-auto text-cyan-400" />
                <h1 className="text-3xl font-bold text-white mt-4">Secure Login</h1>
                <p className="text-gray-400">Access your Industrial ERP Dashboard</p>
            </div>
            <Alert message={notification.message} type={notification.type} />
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input icon={<Mail size={20} />} type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} />
                <Input icon={<KeyRound size={20} />} type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} />
                <Button type="submit" isLoading={loading}>Login</Button>
            </form>
            <div className="text-center">
                <button onClick={onSwitchToRegister} className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
                    Don't have an account? Sign Up
                </button>
            </div>
        </div>
    );
};

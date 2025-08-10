"use client";
import { apiService } from '../../services/api';    
import { Input, Button, Select } from '../ui';
import { User, Mail, Phone, UserCheck, Briefcase, KeyRound } from 'lucide-react';
import { X } from 'lucide-react';


import React, { useState, useEffect } from 'react';

export const UserModal = ({ user, onClose, onSave, token }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone_number: '', role: 'Employee',
        designation: '', password: '',
    });
    const [errors, setErrors] = useState({});
    const isEditMode = Boolean(user);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                role: user.role || 'Employee',
                designation: user.designation || '',
                password: '', // Password is not pre-filled for security
            });
        }
    }, [user, isEditMode]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const validateForm = () => {
        // Add validation logic here...
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) {
            // Don't send empty password on update
            delete dataToSubmit.password;
        }

        let response;
        if (isEditMode) {
            response = await apiService.updateUser(user.id, dataToSubmit, token);
        } else {
            response = await apiService.register(dataToSubmit, token);
        }

        if (response.success) {
            onSave(response.user);
            onClose();
        } else {
            // Handle error display
            console.error("Failed to save user:", response.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">{isEditMode ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Form fields for user data */}
                    <Input icon={<User size={20} />} name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required />
                    <Input icon={<Mail size={20} />} type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required />
                    <Input icon={<Phone size={20} />} name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Phone Number" />
                    <Select icon={<UserCheck size={20} />} name="role" value={formData.role} onChange={handleInputChange}>
                        <option value="Employee">Employee</option>
                        <option value="HOD">HOD</option>
                        <option value="Quality">Quality</option>
                        <option value="Admin">Admin</option>
                    </Select>
                    <Input icon={<Briefcase size={20} />} name="designation" value={formData.designation} onChange={handleInputChange} placeholder="Designation" />
                    <Input icon={<KeyRound size={20} />} type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={isEditMode ? 'New Password (Optional)' : 'Password'} required={!isEditMode} />
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Create User'}</Button>
                </form>
            </div>
        </div>
    );
};
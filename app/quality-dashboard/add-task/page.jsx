"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { ArrowLeft, User, Building, Hash, MapPin, Upload } from 'lucide-react';
import { Input, Button } from '../../../components/ui.jsx';
import { apiService } from '../../../services/api'; // Make sure this path is correct
import router from 'next/router'; // Import Next.js router for navigation
export default function AddTaskPage() {
    const [formData, setFormData] = useState({
        partName: '',
        companyName: '',
        sapCode: '',
        location: '',
        comments: ''
    });
    const [images, setImages] = useState([]);
    
    // State for managing parts data from the API
    const [parts, setParts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // 1. Fetch parts data when the component mounts
    useEffect(() => {
        const fetchParts = async () => {
            try {
                // You need to get the token from your auth context or local storage
                const token = localStorage.getItem('accessToken'); 
                if (!token) {
                    throw new Error("Authentication token not found.");
                }

                const response = await apiService.getAllParts(token);
                if (response.success) {
                    setParts(response.parts);
                } else {
                    throw new Error(response.message || "Failed to fetch parts.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Fetch parts error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchParts();
    }, []); // Empty dependency array means this runs once on mount

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // 2. Special handling for the parts dropdown
        if (name === 'partName') {
            const selectedPart = parts.find(part => part.part_name === value);
            
            if (selectedPart) {
                setFormData(prev => ({
                    ...prev,
                    partName: selectedPart.part_name,
                    companyName: selectedPart.company_name || '',
                    sapCode: selectedPart.sap_code || ''
                }));
            } else {
                // Reset if the user selects the default option
                setFormData(prev => ({
                    ...prev,
                    partName: '',
                    companyName: '',
                    sapCode: ''
                }));
            }
        } else {
            // Standard handling for other inputs
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setIsSubmitting(true);

        // --- Create a FormData object ---
        // This is necessary for sending files along with text data.
        const taskData = new FormData();
        taskData.append('sapCode', formData.sapCode);
        taskData.append('location', formData.location);
        taskData.append('comments', formData.comments);
        
        // Append all selected image files
        images.forEach(image => {
            taskData.append('images', image);
        });

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const result = await apiService.addTask(taskData, token);

            if (result.success) {
                alert('Task submitted successfully!');
                // Optional: redirect the user or clear the form
                router.push('/quality-dashboard'); 
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError(err.message);
            console.error('Submit task error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white">
            <Navbar />
            <main className="pt-24 p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/quality-dashboard" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6">
                        <ArrowLeft size={20} />
                        Back to Quality Dashboard
                    </Link>
                    <div className="bg-gray-800/50 p-8 rounded-lg shadow-xl">
                        <h1 className="text-3xl font-bold mb-6 text-white">Add New Quality Task</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 3. Replaced Input with a Select dropdown for Part Name */}
                                <div className="relative">
                                    <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="partName"
                                        value={formData.partName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 appearance-none"
                                    >
                                        <option value="">
                                            {isLoading ? "Loading parts..." : "Select a Part"}
                                        </option>
                                        {!isLoading && parts.map(part => (
                                            <option key={part.id} value={part.part_name}>
                                                {part.part_name}
                                            </option>
                                        ))}
                                    </select>
                                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                                </div>
                                
                                <Input icon={<Building size={20} />} name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleInputChange} required readOnly />
                                <Input icon={<Hash size={20} />} name="sapCode" placeholder="SAP Code" value={formData.sapCode} onChange={handleInputChange} required readOnly />
                                <Input icon={<MapPin size={20} />} name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} required />
                            </div>

                            {/* Image Upload and Comments sections remain the same */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <Upload size={40} className="mx-auto text-gray-500" />
                                        <div className="flex text-sm text-gray-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-cyan-500 px-2">
                                                <span>Upload files</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} multiple />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                                {images.length > 0 && (
                                    <div className="mt-4 text-sm text-gray-300">
                                        Selected files: {images.map(file => file.name).join(', ')}
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="comments" className="block text-sm font-medium text-gray-300 mb-2">Comments</label>
                                <textarea 
                                    id="comments"
                                    name="comments"
                                    rows={4}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                                    placeholder="Add any comments here..."
                                    value={formData.comments}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {error && <p className="text-red-500 bg-red-900/20 p-3 rounded-md mb-4">{error}</p>}
                            <div className="pt-4">
                                <Button type="submit" disabled={isSubmitting} >
                                    Submit Task
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
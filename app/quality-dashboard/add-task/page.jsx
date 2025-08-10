"use client";

import React from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { ArrowLeft, User, Building, Hash, MapPin, Upload } from 'lucide-react';
import { useState } from 'react';
import { Input, Button } from '../../../components/ui.jsx';

export default function AddTaskPage() {
    const [formData, setFormData] = useState({
        partName: '',
        companyName: '',
        sapCode: '',
        location: '',
        comments: ''
    });
    const [images, setImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            // Convert FileList to array and store it
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle the form submission,
        // including uploading images and sending data to your API.
        console.log({ ...formData, images });
        alert('Task data logged to console. See implementation notes in the code.');
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
                                <Input icon={<User size={20} />} name="partName" placeholder="Part Name" value={formData.partName} onChange={handleInputChange} required />
                                <Input icon={<Building size={20} />} name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleInputChange} required />
                                <Input icon={<Hash size={20} />} name="sapCode" placeholder="SAP Code" value={formData.sapCode} onChange={handleInputChange} required />
                                <Input icon={<MapPin size={20} />} name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} required />
                            </div>
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
                            <div className="pt-4">
                                <Button type="submit">
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

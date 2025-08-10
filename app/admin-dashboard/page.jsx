// import { Navbar } from '../../components/Navbar';
import Navbar from '../../components/Navbar';
import { UserManagement } from '../../components/admin/UserManagement';
import React from 'react';


export default function AdminDashboardPage() {
  return (
    // FIX: Added overflow-hidden to the root div to contain the decorative blobs
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col font-sans overflow-hidden">
      {/* In your project, this would be: import { Navbar } from '../../components/Navbar'; */}
      <Navbar />
      
      {/* This container handles the main page content, including padding for the fixed navbar */}
      <div className="relative flex-1 flex flex-col pt-16">
        
        {/* Decorative background elements are now contained */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-cyan-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-indigo-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
        </div>
        
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <h2 className="text-2xl font-bold tracking-wider">MECHANICAL ERP</h2>
            <p className="text-sm text-gray-400">Project Sentinel Hello</p>
        </header>

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* In your project, this would be: import { UserManagement } from '../../components/admin/UserManagement'; */}
            <UserManagement />
        </main>
        
        <footer className="w-full text-center p-4 text-gray-500 text-sm mt-auto">
            © {new Date().getFullYear()} Mechanical Industrial Solutions. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
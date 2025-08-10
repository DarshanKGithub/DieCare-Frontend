"use client";

import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function QualityDashboard() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col font-sans relative overflow-hidden">
      <Navbar />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-cyan-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-indigo-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      <main className="flex-1 flex flex-col pt-16">
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <h2 className="text-2xl font-bold tracking-wider">MECHANICAL ERP</h2>
            <p className="text-sm text-gray-400">Project Sentinel</p>
        </header>

        <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Quality Dashboard</h1>
                <p className="mt-4 text-gray-300">Manage and track quality control tasks.</p>
                {/* Future content like a list of tasks would go here */}
            </div>
        </div>
        
        <footer className="w-full text-center p-4 text-gray-500 text-sm">
            © {new Date().getFullYear()} Mechanical Industrial Solutions. All rights reserved.
        </footer>
      </main>

      {/* Floating Action Button to Add Task */}
      <Link href="/quality-dashboard/add-task" className="fixed bottom-8 right-8 bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110">
          <Plus size={24} />
      </Link>
    </div>
  );
}
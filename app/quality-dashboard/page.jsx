"use client";

import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api'; // Ensure this path is correct

export default function QualityDashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error("Please log in.");
        
        const response = await apiService.getAllTasks(token);
        if (response.success) {
          setTasks(response.tasks);
        } else {
          throw new Error(response.message || 'Failed to fetch tasks.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col font-sans relative overflow-hidden">
      <Navbar />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-cyan-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-indigo-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      <main className="flex-1 flex flex-col pt-24 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <header className="w-full">
            <h1 className="text-4xl font-bold">Quality Dashboard</h1>
            <p className="mt-2 text-gray-300">Manage and track quality control tasks.</p>
        </header>

        <div className="flex-1 w-full mt-8">
          {isLoading ? (
            <p className="text-center text-gray-400">Loading tasks...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks found. Click the '+' button to add one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
              ))}
            </div>
          )}
        </div>
        
        <footer className="w-full text-center p-4 text-gray-500 text-sm mt-auto">
          © {new Date().getFullYear()} Mechanical Industrial Solutions. All rights reserved.
        </footer>
      </main>

      {/* Floating Action Button to Add Task */}
      <Link href="/quality-dashboard/add-task" className="fixed bottom-8 right-8 bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110">
          <Plus size={24} />
      </Link>
      
      {/* Modal for displaying task details */}
      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
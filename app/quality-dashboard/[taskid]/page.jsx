"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Tag, MapPin, Building, Calendar, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { apiService } from '@/services/api';
import { useParams } from 'next/navigation';

export default function TaskDetailPage() {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error("Please log in.");
        const response = await fetch(`${API_URL}/api/tasks/${params.taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setTask(data.task);
        } else {
          throw new Error(data.error || 'Failed to fetch task.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [params.taskId]);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <Navbar />
      <main className="pt-24 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/quality-dashboard" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6">
            <ArrowLeft size={20} />
            Back to Quality Dashboard
          </Link>
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Task Details</h1>
            {isLoading && <p className="text-gray-400">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {task && (
              <div className="space-y-4 text-gray-300">
                <h2 className="text-2xl font-bold text-white mb-1">{task.part_name || 'Untitled'}</h2>
                <p className="text-gray-400 mb-6">{task.company_name || 'Unknown Company'}</p>
                <div className="flex items-center gap-3">
                  <Tag size={16} className="text-cyan-400" />
                  <strong>SAP Code:</strong> {task.sap_code || 'N/A'}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-cyan-400" />
                  <strong>Location:</strong> {task.location || 'N/A'}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-cyan-400" />
                  <strong>Date:</strong> {task.created_at ? new Date(task.created_at).toLocaleString() : 'N/A'}
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare size={16} className="text-cyan-400 mt-1" />
                  <strong>Comments:</strong> <p className="flex-1">{task.comments || 'No comments.'}</p>
                </div>
                {task.image_urls?.length > 0 && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <ImageIcon size={16} className="text-cyan-400" />
                      <strong>Images:</strong>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {task.image_urls.map((url, index) => (
                        <a
                          key={index}
                          href={`${API_URL}/${url.replace(/\\/g, '/')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${API_URL}/${url.replace(/\\/g, '/')}`}
                            alt={`Task image ${index + 1}`}
                            className="w-full h-auto rounded-md object-cover hover:opacity-80 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import { X, Tag, MapPin, Building, Calendar, MessageSquare, Image as ImageIcon } from 'lucide-react';

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-1">{task.part_name || 'Untitled'}</h2>
          <p className="text-gray-400 mb-6">{task.company_name || 'Unknown Company'}</p>

          <div className="space-y-4 text-gray-300">
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
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
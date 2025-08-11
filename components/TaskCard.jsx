"use client";

import { MapPin } from 'lucide-react';

const TaskCard = ({ task, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-gray-800/60 p-4 rounded-lg shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-600 transition-all duration-300 cursor-pointer"
  >
    <h3 className="font-bold text-lg text-white truncate">{task.part_name}</h3>
    <p className="text-sm text-gray-400 truncate">{task.company_name}</p>
    <div className="mt-4 flex items-center gap-2 text-xs text-gray-300">
      <MapPin size={14} />
      <span className="truncate">{task.location}</span>
    </div>
    <div className="mt-2 text-xs text-gray-500">
      {new Date(task.created_at).toLocaleString()}
    </div>
  </div>
);

export default TaskCard;
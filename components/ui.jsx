 import React from 'react';
 // FIX: Import the icon used in the Button component
import { ChevronsRight } from 'lucide-react';


// ============================================================================
// --- Reusable UI Components ---
// FILE: /components/ui.jsx
// NOTE: Export each component.
// ============================================================================
export const Input = ({ icon, ...props }) => (
  <div className="relative flex items-center">
    <span className="absolute left-4 text-gray-400">{icon}</span>
    <input
      className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
      {...props}
    />
  </div>
);

export const Select = ({ icon, children, ...props }) => (
    <div className="relative flex items-center">
        <span className="absolute left-4 text-gray-400">{icon}</span>
        <select
            className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 appearance-none"
            {...props}
        >
            {children}
        </select>
    </div>
);


export const Button = ({ children, isLoading, ...props }) => (
  <button
    className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
    disabled={isLoading}
    {...props}
  >
    {isLoading ? (
      <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>
    ) : (
      <>{children}<ChevronsRight size={20} /></>
    )}
  </button>
);

export const Alert = ({ message, type }) => {
    if (!message) return null;
    const baseClasses = 'w-full p-4 mb-4 rounded-lg text-center';
    const typeClasses = type === 'success' 
        ? 'bg-green-900/50 text-green-300 border border-green-700' 
        : 'bg-red-900/50 text-red-300 border border-red-700';
    return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};
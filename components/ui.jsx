"use client";

import { ChevronsRight, X } from 'lucide-react';

export const Input = ({ icon, error, ...props }) => (
  <div className="relative flex items-center">
    <span className="absolute left-4 text-gray-400">{icon}</span>
    <input
      className={`w-full pl-12 pr-4 py-3 bg-gray-700 border ${
        error ? 'border-red-600' : 'border-gray-600'
      } rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300`}
      {...props}
    />
    {error && <p className="absolute -bottom-6 text-xs text-red-500">{error}</p>}
  </div>
);

export const Select = ({ icon, error, children, ...props }) => (
  <div className="relative flex items-center">
    <span className="absolute left-4 text-gray-400">{icon}</span>
    <select
      className={`w-full pl-12 pr-4 py-3 bg-gray-700 border ${
        error ? 'border-red-600' : 'border-gray-600'
      } rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 appearance-none`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="absolute -bottom-6 text-xs text-red-500">{error}</p>}
  </div>
);

export const Button = ({ children, isLoading, variant = 'primary', ...props }) => {
  const baseClasses =
    'w-full flex justify-center items-center gap-2 font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed';
  const variantClasses =
    variant === 'secondary'
      ? 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
      : variant === 'destructive'
      ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      : 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500';

  return (
    <button className={`${baseClasses} ${variantClasses}`} disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {children}
          {variant === 'primary' && <ChevronsRight size={20} />}
        </>
      )}
    </button>
  );
};

export const Alert = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const baseClasses = 'w-full p-4 mb-4 rounded-lg text-center relative';
  const typeClasses =
    type === 'success'
      ? 'bg-green-900/50 text-green-300 border border-green-700'
      : type === 'error'
      ? 'bg-red-900/50 text-red-300 border border-red-700'
      : type === 'warning'
      ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
      : 'bg-blue-900/50 text-blue-300 border border-blue-700';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
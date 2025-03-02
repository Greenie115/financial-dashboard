import React from 'react';

export const TabGroup = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);

export const TabList = ({ children, className = "" }) => (
  <div className={`flex border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const Tab = ({ children, active, onClick }) => (
  <button 
    className={`px-4 py-2 font-medium text-sm transition-colors ${
      active ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export const TabPanels = ({ children }) => (
  <div className="mt-4">
    {children}
  </div>
);

export const TabPanel = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);
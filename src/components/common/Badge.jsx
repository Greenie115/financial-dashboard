import React from 'react';

export const Badge = ({ children, color = "gray" }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };
  
  return (
    <span className={`${colorClasses[color]} text-xs px-2 py-1 rounded-full font-medium`}>
      {children}
    </span>
  );
};
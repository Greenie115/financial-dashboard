import React from 'react';

export const Grid = ({ children, cols = 1, className = "" }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  return (
    <div className={`grid ${gridCols[cols]} gap-6 ${className}`}>
      {children}
    </div>
  );
};
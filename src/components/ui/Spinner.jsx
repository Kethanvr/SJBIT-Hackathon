import React from 'react';

const Spinner = ({ className = '', size = 'h-8 w-8', color = 'border-blue-500' }) => (
  <div className={`animate-spin rounded-full ${size} border-b-2 ${color} ${className}`}></div>
);

export default Spinner;

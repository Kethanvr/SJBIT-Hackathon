import React from 'react';

const AlertMessage = ({ type = 'error', children }) => {
  const base = type === 'success'
    ? 'bg-green-100 border-green-400 text-green-700'
    : 'bg-red-100 border-red-400 text-red-700';
  return (
    <div className={`${base} border px-4 py-3 rounded mb-4`}>
      {children}
    </div>
  );
};

export default AlertMessage;

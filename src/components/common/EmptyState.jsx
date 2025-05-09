import React from 'react';
import { FiSearch } from 'react-icons/fi'; // Or any other relevant icon

/**
 * A reusable component to display an empty state message.
 * @param {object} props
 * @param {React.ReactNode} [props.icon=<FiSearch />] - Icon to display.
 * @param {string} props.title - The main title message.
 * @param {string} props.message - The descriptive message.
 * @param {React.ReactNode} [props.actions] - Optional action buttons or links.
 * @param {string} [props.className=''] - Additional CSS classes for the container.
 */
const EmptyState = ({ 
  icon = <FiSearch className="w-8 h-8 text-gray-400" />, 
  title, 
  message, 
  actions, 
  className = '' 
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-gray-900 font-medium">{title}</h3>
      {message && <p className="text-gray-500 mt-1">{message}</p>}
      {actions && <div className="mt-4 flex justify-center space-x-3">{actions}</div>}
    </div>
  );
};

export default EmptyState;

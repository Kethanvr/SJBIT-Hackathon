import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

/**
 * A reusable search input component.
 * @param {object} props
 * @param {string} props.value - The current value of the input.
 * @param {Function} props.onChange - Function to call when the input value changes.
 * @param {Function} props.onClear - Function to call when the clear button is clicked.
 * @param {string} [props.placeholder='Search...'] - Placeholder text for the input.
 * @param {string} [props.className=''] - Additional CSS classes for the container div.
 * @param {string} [props.inputClassName=''] - Additional CSS classes for the input element.
 */
const SearchInput = ({ 
  value, 
  onChange, 
  onClear, 
  placeholder = 'Search...', 
  className = '',
  inputClassName = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-100 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
      />
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

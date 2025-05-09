import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

/**
 * SearchInput - A reusable search input component with clear functionality
 * 
 * @param {Object} props
 * @param {string} props.value - Current search query value
 * @param {Function} props.onChange - Function to handle input changes
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.inputClassName] - Additional CSS classes for the input element
 * @param {string} [props.ariaLabel] - Accessibility label for the input
 */
const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  ariaLabel = 'Search',
}) => {
  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full bg-gray-100 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
      />
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      {value && (
        <button
          type="button"
          onClick={handleClear}
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

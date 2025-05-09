import React from 'react';

const SelectField = ({ label, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {children}
    </select>
  </div>
);

export default SelectField;

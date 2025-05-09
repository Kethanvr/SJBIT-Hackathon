import React from 'react';
import { useProTheme } from '../../utils/useProTheme';

const NotificationToggle = ({ label, checked, onChange }) => {
  const { isPro } = useProTheme();
  
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 ${isPro ? 'peer-focus:ring-yellow-300' : 'peer-focus:ring-blue-300'} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isPro ? 'peer-checked:bg-yellow-600' : 'peer-checked:bg-blue-600'}`}></div>
      </label>
    </div>
  );
};

export default NotificationToggle;

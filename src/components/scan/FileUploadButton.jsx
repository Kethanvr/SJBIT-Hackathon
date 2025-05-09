import React from 'react';
import { FiUpload } from 'react-icons/fi';

const FileUploadButton = ({ onClick, disabled, label, inputRef, onChange }) => (
  <>
    <button
      onClick={onClick}
      className="w-full bg-blue-50 text-blue-700 py-3 rounded-full font-medium flex items-center justify-center space-x-2 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
      disabled={disabled}
    >
      <FiUpload className="w-5 h-5" />
      <span>{label}</span>
    </button>
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      onChange={onChange}
      className="hidden"
      disabled={disabled}
    />
  </>
);
export default FileUploadButton;

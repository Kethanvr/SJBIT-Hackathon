import React from "react";
import { FiCamera, FiX } from "react-icons/fi";

export default function ProfileAvatar({
  avatarUrl,
  fullName,
  isEditing,
  uploading,
  onImageUpload,
  onRemoveImage
}) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
          {uploading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <img
              src={
                avatarUrl ||
                `https://ui-avatars.com/api/?name=${fullName || "User"}&size=200`
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={e => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${fullName || "User"}&size=200`;
              }}
            />
          )}
        </div>
        {isEditing && !uploading && (
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
          >
            <FiCamera className="w-4 h-4" />
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              disabled={uploading}
              aria-label="Upload profile picture"
            />
          </label>
        )}
      </div>
      {isEditing && avatarUrl && !uploading && (
        <button
          type="button"
          onClick={onRemoveImage}
          className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center space-x-1"
        >
          <FiX className="w-4 h-4" />
          <span>Remove Picture</span>
        </button>
      )}
    </div>
  );
}

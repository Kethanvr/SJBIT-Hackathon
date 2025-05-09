import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCamera,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import Input from "../../components/ui/Input"; // Import the Input component
import { cn } from "../../utils/cn"; // Import the cn utility function
import { uploadToCloudinary } from "../../utils/cloudinaryUtils"; // Import Cloudinary utility
import ProfileAvatar from "../../components/user/ProfileAvatar";
import LabeledField from "../../components/ui/LabeledField";
import { usePersonalInfo } from "../../hooks/usePersonalInfo";

export default function PersonalInfo() {
  const {
    profile,
    loading,
    uploading,
    error,
    isEditing,
    setIsEditing,
    formData,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleChange,
  } = usePersonalInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white px-4 py-4 border-b fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/account" className="text-gray-600 hover:text-gray-800">
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold">Personal Info</h1>
          </div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-gray-600 text-sm font-medium hover:text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-6 mt-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {/* Profile Picture */}
          <ProfileAvatar
            avatarUrl={profile?.avatar_url}
            fullName={profile?.full_name}
            isEditing={isEditing}
            uploading={uploading}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
          />
          {/* Form Fields */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y">
              <div className="p-4 space-y-4">
                <div>
                  {isEditing ? (
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      label="Username"
                      icon={<FiUser className="w-5 h-5 text-gray-400" />}
                      value={formData.username}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    <LabeledField label="Username" value={profile?.username} />
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <Input
                      type="text"
                      id="full_name"
                      name="full_name"
                      label="Full Name"
                      value={formData.full_name}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    <LabeledField label="Full Name" value={profile?.full_name} />
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <Input
                      type="email"
                      id="recovery_email"
                      name="recovery_email"
                      label="Recovery Email"
                      icon={<FiMail className="w-5 h-5 text-gray-400" />}
                      value={formData.recovery_email}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    <LabeledField label="Recovery Email" value={profile?.recovery_email} />
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile?.phone || "Not set"}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob || ""}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile?.gender || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Save Button - Fixed positioning for mobile */}
          {isEditing && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
              <div className="max-w-lg mx-auto">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full mt-2 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

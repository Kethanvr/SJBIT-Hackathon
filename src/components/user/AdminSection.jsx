import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSend, FiPieChart } from "react-icons/fi";

/**
 * Component for admin-only functionality in the account menu
 */
const AdminSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
        onClick={() => navigate("/admin/send-notification")}
      >
        <div className="flex items-center space-x-3">
          <FiSend className="w-6 h-6 text-blue-500" />
          <span className="font-medium text-blue-700">Send Notification</span>
        </div>
        <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">Admin</span>
      </div>
      
      <div
        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
        onClick={() => navigate("/admin/dashboard")}
      >
        <div className="flex items-center space-x-3">
          <FiPieChart className="w-6 h-6 text-purple-500" />
          <span className="font-medium text-purple-700">Analytics Dashboard</span>
        </div>
        <span className="text-xs text-purple-500 bg-purple-100 px-2 py-1 rounded-full">Admin</span>
      </div>
    </>
  );
};

export default AdminSection;

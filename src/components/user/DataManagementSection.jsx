import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiTrash2, FiCamera, FiMessageSquare, FiAlertTriangle } from "react-icons/fi";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";

const DataManagementSection = ({ onDeleteAllData }) => {
  const { t } = useTranslation("account");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Define menu items for better maintainability
  const menuItems = [
    {
      id: "scanHistory",
      icon: <FiCamera className="w-6 h-6 text-gray-400" />,
      label: t("scanHistory"),
      description: t("scanHistoryDesc"),
      to: "/scan/history",
    },
    {
      id: "chatHistory",
      icon: <FiMessageSquare className="w-6 h-6 text-gray-400" />,
      label: t("chatHistory"),
      description: t("chatHistoryDesc"),
      to: "/chat/history",
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="p-4 border-b">
          <h3 className="font-medium">{t("dataManagement")}</h3>
          <p className="text-sm text-gray-500 mt-1">{t("dataManagementDesc")}</p>
        </div>
        
        {/* History Menu Items */}
        <div className="divide-y">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <div>
                  <span className="font-medium">{item.label}</span>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Data deletion section */}
          <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <FiTrash2 className="w-6 h-6 text-red-400 mt-1" />
                <div>
                  <span className="text-red-500 font-medium">{t("deleteAllData")}</span>
                  <p className="text-sm text-gray-500 mt-1">{t("deleteAllDataDesc")}</p>
                  <div className="mt-2 flex items-center space-x-2 text-xs text-amber-600">
                    <FiAlertTriangle className="w-4 h-4" />
                    <span>{t("deleteConfirm.warning")}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors duration-200"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onDeleteAllData}
        title={t("deleteConfirm.title")}
        message={t("deleteConfirm.message")}
        itemName={t("allData")}
        confirmText={t("deleteConfirm.confirm")}
        cancelText={t("deleteConfirm.cancel")}
        t={t}
      />
    </>
  );
};

export default DataManagementSection;

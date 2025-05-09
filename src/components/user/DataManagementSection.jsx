import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiTrash2, FiCamera, FiMessageSquare } from "react-icons/fi";
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
      to: "/scan/history",
    },
    {
      id: "chatHistory",
      icon: <FiMessageSquare className="w-6 h-6 text-gray-400" />,
      label: t("chatHistory"),
      to: "/chat/history",
    },
  ];

  return (
    <>
      <div className="p-4 border-b">
        <h3 className="font-medium">{t("dataManagement")}</h3>
      </div>
      <div className="divide-y">
        {/* Data deletion section */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <FiTrash2 className="w-6 h-6 text-red-400" />
            <div>
              <span className="text-red-500 font-medium">{t("deleteAllData")}</span>
              <p className="text-sm text-gray-500">{t("deleteAllDataDesc")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1 text-red-500 border border-red-200 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            {t("delete")}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onDeleteAllData}
        itemName={t("allData")}
        itemType="data"
        t={t}
      />
    </>
  );
};

export default DataManagementSection;

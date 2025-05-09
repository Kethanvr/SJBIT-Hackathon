import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Reusable logout button component
 */
const LogoutButton = ({ onLogout, loading }) => {
  const { t } = useTranslation("account");

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="w-full p-4 text-red-600 bg-white rounded-2xl shadow-sm hover:bg-gray-50 font-medium disabled:opacity-50"
    >
      {loading ? t("loggingOut") : t("logOut")}
    </button>
  );
};

export default LogoutButton;

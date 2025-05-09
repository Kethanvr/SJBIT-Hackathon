// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\health\HealthRecordErrorAlert.jsx
import React from "react";
import { useProTheme } from "../../utils/useProTheme";

const HealthRecordErrorAlert = ({ error }) => {
  const { isPro, theme } = useProTheme();
  
  if (!error) return null;
  
  return (
    <div className={`${isPro ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded mb-4 border`}>
      {error}
    </div>
  );
};

export default HealthRecordErrorAlert;

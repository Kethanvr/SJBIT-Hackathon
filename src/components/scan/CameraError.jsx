import React from 'react';
import { useTranslation } from 'react-i18next';
import StandardErrorMessage from '../common/StandardErrorMessage';

const CameraError = ({ message }) => {
  const { t } = useTranslation('scanner');
  
  const fullMessage = (
    <>
      <p className="font-semibold">{t('cameraError.title')}</p>
      <p className="text-sm mt-1">{message}</p>
      <p className="text-xs mt-2">{t('cameraError.permission')}</p>
    </>
  );
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <StandardErrorMessage 
        message={fullMessage}
        type="error"
        icon="camera"
        fullWidth
      />
    </div>
  );
};
export default CameraError;

import React from 'react';
import StandardErrorMessage from './StandardErrorMessage';

const ErrorAlert = ({ title, message }) => {
  const combinedMessage = (
    <>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1">{message}</p>
    </>
  );
  
  return (
    <StandardErrorMessage 
      message={combinedMessage}
      type="error"
    />
  );
};

export default ErrorAlert;

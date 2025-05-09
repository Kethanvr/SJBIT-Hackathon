import React from 'react';
import StandardErrorMessage from '../common/StandardErrorMessage';

const NetworkErrorBanner = ({ message, onDismiss }) => (
  <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30">
    <StandardErrorMessage
      message={message}
      type="error"
      onDismiss={onDismiss}
      icon="network"
    />
  </div>
);
export default NetworkErrorBanner;

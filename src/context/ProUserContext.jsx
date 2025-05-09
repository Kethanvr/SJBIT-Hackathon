/**
* ProUserContext - Simplified context that always returns non-pro status
* 
* This context has been modified to always return isPro: false since the app 
* has been standardized to use only the blue theme.
 */
import React, { createContext, useContext } from 'react';

// Create context with default non-pro values
const ProUserContext = createContext({
  isPro: false,
  loading: false,
  refreshProStatus: () => {},
});

export function ProUserProvider({ children }) {
  // Simplified version that always returns isPro: false
  const isPro = false;
  const loading = false;
  const refreshProStatus = () => {}; // No-op function

  return (
    <ProUserContext.Provider value={{ isPro, loading, refreshProStatus }}>
      {children}
    </ProUserContext.Provider>
  );
}

// Custom hook to use the context
export function useProUser() {
  return useContext(ProUserContext);
}

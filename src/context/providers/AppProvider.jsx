import React from 'react';
import { ThemeProvider } from '../ThemeContext';
import { LanguageProvider } from '../LanguageContext';
import { ProUserProvider } from '../ProUserContext';
import ErrorBoundary from '../../components/ui/ErrorBoundary';

/**
 * AppProvider component to wrap the application with all required context providers
 * This creates a more organized pattern for managing application-wide state
 */
const AppProvider = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ProUserProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ProUserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};


export default AppProvider;
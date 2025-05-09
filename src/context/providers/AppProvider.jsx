import React from 'react';
import { ThemeProvider } from '../ThemeContext';
import { LanguageProvider } from '../LanguageContext';
import ErrorBoundary from '../../components/ui/ErrorBoundary';

/**
 * AppProvider component to wrap the application with all required context providers
 * This creates a more organized pattern for managing application-wide state
 */
const AppProvider = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};


export default AppProvider;
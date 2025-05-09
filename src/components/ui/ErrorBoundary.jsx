import React from 'react';
import { withTranslation } from 'react-i18next';
import { FiAlertCircle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { useSafeProTheme } from '../../utils/useSafeProTheme';
import Button from './Button';

/**
 * Default fallback UI for error states
 */
const DefaultErrorFallback = ({ error, resetError, t, isPro, theme }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
    <div className={`rounded-full p-4 mb-4 ${isPro ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
      <FiAlertCircle className="text-3xl" />
    </div>
    
    <h2 className="text-xl font-semibold mb-2">{t('error.title', 'Something went wrong')}</h2>
    
    <p className="text-gray-600 mb-6 max-w-md">
      {t('error.message', 'An error occurred while loading this section. You can try refreshing or return to the home page.')}
    </p>
    
    {process.env.NODE_ENV === 'development' && (
      <div className="bg-gray-100 p-4 rounded-lg mb-6 max-w-full overflow-auto text-left">
        <p className="font-mono text-xs text-red-600 whitespace-pre-wrap">
          {error?.message || 'Unknown error'}
        </p>
      </div>
    )}
    
    <div className="flex space-x-4">
      <Button 
        variant="theme" 
        leftIcon={<FiRefreshCw />}
        onClick={resetError}
      >
        {t('error.retry', 'Try Again')}
      </Button>
      
      <Button 
        variant="outline"
        leftIcon={<FiHome />}
        onClick={() => window.location.href = '/'}
      >
        {t('error.home', 'Home')}
      </Button>
    </div>
  </div>
);

// Wrap with withTranslation HOC to get i18n capabilities
const TranslatedErrorFallback = withTranslation()(({ t, ...props }) => {
  // Use our safer hook which has built-in error handling
  const { isPro, theme } = useSafeProTheme();
  return <DefaultErrorFallback t={t} isPro={isPro} theme={theme} {...props} />;
});

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the app
 * 
 * Props:
 * @param {ReactNode} children - Components to render
 * @param {ReactNode|Function} fallback - Custom fallback UI or render prop
 * @param {Function} onError - Optional callback for when an error is caught
 * @param {string} errorKey - Unique identifier for logging/tracking
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Increment error count to prevent infinite loops
    this.setState(prevState => ({
      errorInfo, 
      errorCount: prevState.errorCount + 1
    }));
    
    // Log error information
    console.error(
      `Error caught by ErrorBoundary ${this.props.errorKey || ''}:`, 
      error, 
      errorInfo
    );
    
    // Optional: send error to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.props.errorKey);
    }
  }

  handleReset = () => {
    // Only reset if we haven't tried too many times
    if (this.state.errorCount < 3) {
      this.setState({ 
        hasError: false,
        error: null,
        errorInfo: null 
      });
    } else {
      // If too many errors, redirect to home
      window.location.href = '/';
    }
  }

  render() {
    const { hasError, error, errorCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI, function render prop, or default error message
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(error, this.handleReset, errorCount)
          : fallback;
      }
      
      // Default translated error UI
      return (
        <TranslatedErrorFallback 
          error={error} 
          resetError={this.handleReset} 
        />
      );
    }

    // When there's no error, render children normally
    return children;
  }
}

// Add displayName for debugging
ErrorBoundary.displayName = 'ErrorBoundary';

// Export the main component
const WrappedErrorBoundary = withTranslation()(ErrorBoundary);
export default WrappedErrorBoundary;

/**
 * Functional wrapper for ErrorBoundary to make it easier to use in function components
 * and to provide default fallback UI with theme support
 */
export const withErrorBoundary = (Component, options = {}) => {
  const WithErrorBoundary = (props) => (
    <WrappedErrorBoundary 
      fallback={options.fallback}
      onError={options.onError}
      errorKey={options.errorKey || Component.displayName || Component.name}
    >
      <Component {...props} />
    </WrappedErrorBoundary>
  );
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  
  return WithErrorBoundary;
};

/**
 * Hook to create an error boundary wrapper with a simple API
 * 
 * Usage:
 * const ErrorBoundaryWrapper = useErrorBoundary();
 * return (
 *   <ErrorBoundaryWrapper>
 *     <YourComponent />
 *   </ErrorBoundaryWrapper>
 * );
 */
export const useErrorBoundary = (options = {}) => {
  const ErrorBoundaryWrapper = ({ children }) => (
    <WrappedErrorBoundary
      fallback={options.fallback}
      onError={options.onError}
      errorKey={options.errorKey}
    >
      {children}
    </WrappedErrorBoundary>
  );
  
  return ErrorBoundaryWrapper;
};
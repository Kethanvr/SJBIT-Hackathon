// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\pages\SplashScreen.jsx
/**
 * SplashScreen Component
 * 
 * This component serves as the initial loading screen of the MediScan application.
 * It displays the app logo, name, and a loading animation while checking authentication status.
 * 
 * Key responsibilities:
 * 1. Display branded splash screen with appropriate styling based on Pro status
 * 2. Check user authentication and redirect accordingly
 * 3. Provide visual feedback during the app initialization
 */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { BsQrCodeScan } from "react-icons/bs";
import { useSafeProTheme } from "../utils/useSafeProTheme";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { withErrorBoundary } from "../components/ui/ErrorBoundary";
import { ROUTES } from "../utils/constants";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get theme support from our safer hook which has built-in error handling
  const { isPro, theme } = useSafeProTheme();

  // Authentication check and redirection logic
  const checkAuth = useCallback(async () => {
    try {
      setError(null);      // First get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      // Get current user from session if it exists
      const user = session?.user;
      
      // Only redirect if we're actually on the splash page
      // This prevents redirection if the component is mounted elsewhere
      if (window.location.pathname === ROUTES.SPLASH) {
        setTimeout(() => {          setIsLoading(false);
          // Redirect based on authentication status
          navigate(user ? ROUTES.HOME : ROUTES.AUTH);
        }, 1500); // Use fixed value instead of ANIMATION_DURATIONS.SPLASH_REDIRECT
      }
    } catch (err) {
      console.error("Authentication check failed:", err);
      setError(err.message);
      setIsLoading(false);
      
      // Still redirect to auth on error after a delay
      setTimeout(() => {
        navigate(ROUTES.AUTH);
      }, 1500); // Use fixed value instead of ANIMATION_DURATIONS.SPLASH_REDIRECT
    }
  }, [navigate]);

  // Run auth check on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Dynamic styling based on Pro status
  const bgGradient = isPro
    ? 'from-yellow-900 to-yellow-700'
    : 'from-blue-900 to-blue-700';
    
  const scanIconBg = isPro ? 'bg-yellow-500' : 'bg-blue-500';
  const taglineColor = isPro ? 'text-yellow-200' : 'text-blue-200';
  const loadingColor = isPro ? 'yellow' : 'white';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-b ${bgGradient} p-4`}>
      {/* Logo container */}
      <div className="flex flex-col items-center mb-12">
        {/* App icon with scan symbol */}
        <div className={`${scanIconBg} w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg mb-4`}>
          <BsQrCodeScan className="text-white text-4xl" />
        </div>
        
        {/* App name */}
        <h1 className="text-4xl font-bold text-white mt-4 tracking-tight">
          Medi<span className="font-light">Scan</span>
        </h1>
        
        {/* App tagline */}
        <p className={`mt-2 ${taglineColor} text-center max-w-xs`}>
          Smart Medicine Scanner & Health Assistant
        </p>
      </div>
      
      {/* Loading indicator */}
      <div className="mt-8">
        {isLoading ? (
          <LoadingSpinner 
            size="lg" 
            color={loadingColor} 
            label="Loading MediScan" 
            variant="dots"
          />
        ) : error ? (
          <div className="text-red-200 text-center">
            <p>Something went wrong while starting the app.</p>
            <button 
              onClick={checkAuth}
              className="mt-4 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>
      
      {/* Version text */}
      <div className="absolute bottom-8 text-white text-opacity-60 text-sm">
        v1.0.0
      </div>
    </div>
  );
};

// Wrap with error boundary for resilience
export default withErrorBoundary(SplashScreen, {
  errorKey: 'splash-screen'
});

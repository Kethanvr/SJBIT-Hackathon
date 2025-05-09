import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "./hooks/useAuth";
import AppProvider from "./context/providers/AppProvider";
import BottomNav from "./components/common/BottomNav";
import StandardLoadingIndicator from "./components/common/StandardLoadingIndicator";
import ScrollToTop from "./utils/helpers/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { ROUTES } from "./utils/constants";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ErrorListener from "./components/common/ErrorListener";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Eagerly loaded components
import SplashScreen from "./pages/SplashScreen";

// Lazily loaded components to improve initial load performance
const Auth = lazy(() => import("./pages/auth/Auth"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Callback = lazy(() => import("./pages/auth/Callback"));
const Home = lazy(() => import("./pages/Home"));
const Scanner = lazy(() => import("./pages/scan/Scanner"));
const History = lazy(() => import("./pages/user/History"));
const ScanHistory = lazy(() => import("./pages/scan/ScanHistory"));
const ScanDetails = lazy(() =>
  import("./pages/scan/ScanHistory").then((module) => ({
    default: module.ScanDetails,
  }))
);
const ChatHistory = lazy(() => import("./pages/chat/ChatHistory"));
const Account = lazy(() => import("./pages/user/Account"));
const PersonalInfo = lazy(() => import("./pages/user/PersonalInfo"));
const Security = lazy(() => import("./pages/auth/Security"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Language = lazy(() => import("./pages/Language"));
const Notifications = lazy(() => import("./pages/user/Notifications"));
const ChatBox = lazy(() =>
  import("./pages/chat/ChatBox").catch((error) => {
    console.error("Error loading ChatBox component:", error);
    return {
      default: () => (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-semibold">Failed to load chat component</p>
            <p className="text-sm mt-2">
              Please try again or contact support if the issue persists.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
      ),
    };
  })
);
const AboutCreators = lazy(() => import("./pages/AboutCreators"));
const HealthRecords = lazy(() => import("./pages/health/HealthRecords"));
const HealthManagement = lazy(() => import("./pages/health/HealthManagement"));
const InsuranceProviders = lazy(() =>
  import("./pages/health/InsuranceProviders")
);
const Updates = lazy(() => import("./pages/Updates"));
const SendNotification = lazy(() => import("./pages/admin/SendNotification"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const HowToUse = lazy(() => import("./pages/HowToUse"));
const Doctors = lazy(() => import("./pages/health/Doctors"));

/**
 * LoadingFallback Component
 *
 * A styled loading component shown while lazy-loaded routes are being fetched
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <StandardLoadingIndicator size="lg" variant="spinner" centered />
  </div>
);

/**
 * AppInitializer Component
 *
 * Manages the initial application loading state and displays the splash screen
 * during startup. This ensures users have a smooth entry experience.
 */
const AppInitializer = () => {
  const [initializing, setInitializing] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Skip splash screen if not on splash route
    if (location.pathname !== ROUTES.SPLASH) {
      setInitializing(false);
      return;
    }

    const timer = setTimeout(() => {
      setInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (initializing) {
    return <SplashScreen />;
  }

  return <AppContent />;
};

/**
 * AppContent component
 *
 * Manages routes and navigation after initialization.
 * Protected routes redirect unauthenticated users to login.
 */
const AppContent = () => {
  const { user, session, loading } = useAuth();
  const location = useLocation();

  // Hide bottom nav on certain routes
  const hideNavbarPaths = ["/chat", "/chatbox", "/scanner"];
  const shouldShowNavbar = !hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // Auth protection
  if (
    !loading &&
    !session &&
    location.pathname !== ROUTES.AUTH &&
    location.pathname !== ROUTES.SPLASH &&
    location.pathname !== ROUTES.HOW_TO_USE &&
    !location.pathname.startsWith("/auth/")
  ) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ErrorBoundary errorKey="app-routes">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.SPLASH} element={<SplashScreen />} />
            <Route
              path={ROUTES.AUTH}
              element={
                !session ? <Auth /> : <Navigate to={ROUTES.HOME} replace />
              }
            />
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path={ROUTES.HOW_TO_USE}
              element={
                <ErrorBoundary errorKey="how-to-use">
                  <HowToUse />
                </ErrorBoundary>
              }
            />

            {/* Protected routes */}
            {session && (
              <>
                {/* Main routes */}
                <Route
                  path={ROUTES.HOME}
                  element={
                    <ErrorBoundary errorKey="home-page">
                      <Home />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path={ROUTES.SCANNER}
                  element={
                    <ErrorBoundary errorKey="scanner">
                      <Scanner />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path={ROUTES.HISTORY}
                  element={
                    <ErrorBoundary errorKey="history">
                      <History />
                    </ErrorBoundary>
                  }
                />

                {/* Scan routes */}
                <Route
                  path="/scan/history"
                  element={
                    <ErrorBoundary errorKey="scan-history">
                      <ScanHistory />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/scan/:id"
                  element={
                    <ErrorBoundary errorKey="scan-details">
                      <ScanDetails />
                    </ErrorBoundary>
                  }
                />

                {/* Chat routes */}
                <Route
                  path={ROUTES.CHAT}
                  element={
                    <ErrorBoundary errorKey="chat">
                      <Suspense fallback={<LoadingFallback />}>
                        <ChatBox />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/chat/:id"
                  element={
                    <ErrorBoundary errorKey="chat-detail">
                      <Suspense fallback={<LoadingFallback />}>
                        <ChatBox />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/chat/history"
                  element={
                    <ErrorBoundary errorKey="chat-history">
                      <ChatHistory />
                    </ErrorBoundary>
                  }
                />

                {/* Account routes */}
                <Route path={ROUTES.ACCOUNT} element={<Account />} />
                <Route
                  path="/account/personal-info"
                  element={<PersonalInfo />}
                />
                <Route path="/account/security" element={<Security />} />
                <Route
                  path="/account/accessibility"
                  element={<Accessibility />}
                />
                <Route path="/account/language" element={<Language />} />
                <Route
                  path="/account/notifications"
                  element={<Notifications />}
                />

                {/* About routes */}
                <Route path="/about-creators" element={<AboutCreators />} />
                <Route path="/about-creators/:id" element={<AboutCreators />} />

                {/* Health routes */}
                <Route
                  path="/health/records"
                  element={
                    <ErrorBoundary errorKey="health-records">
                      <HealthRecords />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/health/management"
                  element={
                    <ErrorBoundary errorKey="health-management">
                      <Suspense fallback={<LoadingFallback />}>
                        <HealthManagement />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/health/insurance-providers"
                  element={
                    <ErrorBoundary errorKey="insurance-providers">
                      <Suspense fallback={<LoadingFallback />}>
                        <InsuranceProviders />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/health/doctors"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Doctors />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                {/* App updates */}
                <Route path={ROUTES.UPDATES} element={<Updates />} />

                {/* Admin routes */}
                <Route
                  path="/admin/send-notification"
                  element={
                    <ErrorBoundary errorKey="admin-notification">
                      <SendNotification />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ErrorBoundary errorKey="admin-dashboard">
                      <Suspense fallback={<LoadingFallback />}>
                        <AdminDashboard />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </>
            )}

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <Navigate to={session ? ROUTES.HOME : ROUTES.AUTH} replace />
              }
            />
          </Routes>
        </Suspense>

        {/* Bottom Navigation */}
        {session && shouldShowNavbar && <BottomNav />}
      </ErrorBoundary>

      {/* Global toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      {/* Global error listener */}
      <ErrorListener position="bottom" autoDismissTime={5000} />
    </div>
  );
};

/**
 * Main App component
 *
 * Wraps the application with necessary providers and handles initialization
 */
function App() {
  return (
    <ErrorBoundary errorKey="app-root">
      <AppProvider>
        <Router>
          <ScrollToTop />
          <AppInitializer />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

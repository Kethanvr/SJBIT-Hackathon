import React from "react";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeScreen from "../../components/auth/WelcomeScreen";
import AuthLoadingSpinner from "../../components/auth/AuthLoadingSpinner";
import ConfirmationSent from "../../components/auth/ConfirmationSent";
import AuthErrorAlert from "../../components/auth/AuthErrorAlert";
import EmailInput from "../../components/auth/EmailInput";
import PasswordInput from "../../components/auth/PasswordInput";
import ForgotPasswordLink from "../../components/auth/ForgotPasswordLink";
import AuthToggleButton from "../../components/auth/AuthToggleButton";
import AuthTermsNotice from "../../components/auth/AuthTermsNotice";
import MediscanLogo from "../../assets/Mediscan.png";
import {
  containerVariants,
  itemVariants,
  generateDecorations,
} from "../../utils/authUIUtils.jsx";
import { ROUTES, STORAGE_KEYS } from "../../utils/constants";
import { supabase } from "../../lib/supabase";
import { AnalyticsTracker } from "../../utils/analyticsTracker";
import "../../styles/animations.css";

export default function Auth() {
  const { signIn, signUp, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Unsplash medical-themed images
  const bgImages = [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Medical tech
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Health monitoring
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Medical app
  ];

  // Select a random image for background variation - MOVED TO TOP LEVEL
  const [bgImage] = useState(
    bgImages[Math.floor(Math.random() * bgImages.length)]
  );
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await signIn(email, password);
        // Check if this is the user's first login
        if (data?.user) {
          // Check if first_login is set in localStorage (set by the useAuth hook during signIn)
          const isFirstLogin =
            localStorage.getItem(STORAGE_KEYS.FIRST_LOGIN) === "true";

          if (isFirstLogin) {
            // Update the first_login flag in the database to false for future logins
            await supabase
              .from("profiles")
              .update({ first_login: false })
              .eq("id", data.user.id);

            // Remove the localStorage flag
            localStorage.removeItem(STORAGE_KEYS.FIRST_LOGIN);

            // Ask the user if they want to see the guide or go directly to the app
            const wantsTutorial = window.confirm(
              "Welcome to MediScan! Would you like to view a quick guide on how to use the app?"
            );
            if (wantsTutorial) {
              // Redirect to the How To Use page
              navigate(ROUTES.HOW_TO_USE);
            } else {
              // Mark that they've skipped the tutorial
              localStorage.setItem("skippedTutorial", "true");

              // Track tutorial skip in analytics
              AnalyticsTracker.trackTutorialSkipped();

              // Redirect to home
              navigate(ROUTES.HOME);
            }
          } else {
            // Regular login, redirect to home
            navigate(ROUTES.HOME);
          }
        }
      } else {
        const data = await signUp(email, password);
        // Check if signup was successful
        if (data?.user) {
          setConfirmationSent(true);
          // Profile will be created automatically by the database trigger or onAuthStateChange
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Conditional returns MUST come AFTER all hook calls
  if (loading) {
    return <AuthLoadingSpinner />;
  }

  if (confirmationSent) {
    return (
      <ConfirmationSent
        email={email}
        onReturnToLogin={() => {
          setConfirmationSent(false);
          setIsLogin(true);
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Medical background"
          className="object-cover w-full h-full opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-blue-800/90 to-cyan-900/90 mix-blend-multiply"></div>
      </div>

      {/* Use the new WelcomeScreen component */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {/* Decorative background elements */}
      {generateDecorations()}

      {/* Animated glass mesh in background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(20,184,166,0.15),rgba(0,0,0,0))]"></div>
        <svg
          className="absolute top-0 left-0 opacity-10"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
              ></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"></rect>
        </svg>
      </div>

      {/* Auth Form Card */}
      <motion.div
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-10 border border-blue-100/30" // Updated border color
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 15,
        }}
      >
        <div className="px-6 py-10 md:px-8 md:py-12">
          <motion.div
            className="text-center mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <div className="w-24 h-24 flex items-center justify-center mx-auto shadow-lg">
                <img
                  src={MediscanLogo}
                  alt="MediScan Logo"
                  className="w-24 h-24 object-contain rounded-full bg-white p-2 border border-blue-200 shadow-md"
                />
              </div>
            </motion.div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2"
              variants={itemVariants}
            >
              MediScan
            </motion.h1>
            <motion.p className="text-gray-500" variants={itemVariants}>
              {isLogin
                ? "Welcome back to your health hub"
                : "Start your health journey"}
            </motion.p>
          </motion.div>{" "}
          <AuthErrorAlert error={error} />
          <motion.form
            onSubmit={handleAuth}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <EmailInput email={email} setEmail={setEmail} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <PasswordInput
                id="password"
                label={isLogin ? "Password" : "Create password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </motion.div>
            <motion.button
              type="submit"
              className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold shadow-lg group overflow-hidden"
              disabled={loading}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">
                {loading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </span>
              <span className="absolute inset-0 overflow-hidden rounded-lg">
                <span className="absolute left-0 aspect-square w-16 rounded-full bg-white/20 -translate-x-full group-hover:animate-[moveRight_1s_ease-in-out]"></span>
              </span>
            </motion.button>
          </motion.form>
          {/* Show Forgot Password only if there is a login error, otherwise show Create Account toggle below */}
          {isLogin && error && (
            <div className="mt-4 text-center">
              <ForgotPasswordLink variants={itemVariants} />
            </div>
          )}
          <motion.div
            className="mt-8 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Show Create Account toggle only if there is no login error or not in login mode */}
            {(!isLogin || !error) && (
              <AuthToggleButton
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                variants={itemVariants}
              />
            )}
          </motion.div>
          <AuthTermsNotice />
        </div>
      </motion.div>
    </div>
  );
}

import React from "react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./i18n"; // Add i18n initialization
import "./index.css";
import App from "./App.jsx";
import { preloadProThemeAssets } from "./utils/proThemeCache";

// Function to prevent text scaling in mobile webview
const preventTextScaling = () => {
  // Force text zoom to be 100%
  document.documentElement.style.fontSize = "16px";

  // Create and add a style element with !important rules
  const style = document.createElement("style");
  style.textContent = `
    html * {
      max-height: 1000000px;
      -webkit-text-size-adjust: none !important;
      -moz-text-size-adjust: none !important;
      -ms-text-size-adjust: none !important;
      text-size-adjust: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Execute on load
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    preventTextScaling();

    // We'll preload Pro theme assets after a short delay to ensure
    // the app has initialized properly
    setTimeout(() => {
      try {
        preloadProThemeAssets();
      } catch (error) {
        console.error("Error preloading theme assets:", error);
      }
    }, 1000);
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

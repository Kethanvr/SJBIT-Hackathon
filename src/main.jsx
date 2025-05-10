import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n"; // i18n initialization
import "./index.css";
import App from "./App";

// Initialize error handling for root component
const appRoot = document.getElementById("root");

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

// Register error handler for uncaught errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // Could add error reporting service here
});

// Register error handler for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled rejection:", event.reason);
  // Could add error reporting service here
});

// Execute text scaling prevention on load
window.addEventListener("DOMContentLoaded", preventTextScaling);

// Create root and render app
createRoot(appRoot).render(
  <StrictMode>
    <App />
  </StrictMode>
);

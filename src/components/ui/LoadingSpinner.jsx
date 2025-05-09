import React from "react";
import { useProTheme } from "../../utils/useProTheme";
import { cn } from "../../utils/cn"; // Add cn utility import
import StandardLoadingIndicator from "../common/StandardLoadingIndicator";

/**
 * LoadingSpinner component - Now just a wrapper around StandardLoadingIndicator for backward compatibility
 *
 * Props:
 * @param {string} size - Size of spinner: "xs", "sm", "md", "lg", "xl"
 * @param {string} color - Color override (passed through to StandardLoadingIndicator)
 * @param {string} className - Additional CSS classes
 * @param {boolean} centered - Whether to center the spinner in its container
 * @param {boolean} fullWidth - Whether the spinner should take full width of container
 * @param {string} thickness - Border thickness override (passed through to StandardLoadingIndicator)
 * @param {string} label - Accessibility label for the spinner
 * @param {string} variant - Visual variant: "spinner" (default), "dots", "overlay"
 *
 * Usage:
 * <LoadingSpinner size="md" color="theme" centered />
 */

const LoadingSpinner = ({
  size = "md",
  color = "theme", // Default to theme-based colors
  className = "",
  centered = false,
  fullWidth = false,
  thickness = "normal",
  label = "Loading...",
  variant = "border",
  ...props
}) => {
  const { isPro, theme } = useProTheme();

  // Size styles with appropriate border widths
  const sizeStyles = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  // Static color styles
  const colorStyles = {
    blue: "border-blue-600",
    gray: "border-gray-600",
    white: "border-white",
    theme: isPro ? "border-yellow-500" : "border-blue-600", // Theme-based coloring
  };

  // Thickness styles
  const thicknessStyles = {
    thin: {
      xs: "border",
      sm: "border",
      md: "border-2",
      lg: "border-2",
      xl: "border-3",
    },
    normal: {
      xs: "border-2",
      sm: "border-2",
      md: "border-3",
      lg: "border-3",
      xl: "border-4",
    },
    thick: {
      xs: "border-2",
      sm: "border-3",
      md: "border-4",
      lg: "border-4",
      xl: "border-[6px]",
    },
  };

  // Override size-based border with thickness if specified
  const borderStyle =
    thickness !== "normal"
      ? thicknessStyles[thickness]?.[size] || thicknessStyles.normal[size]
      : "";

  const containerClasses = cn(
    centered && "flex justify-center items-center",
    fullWidth && "w-full",
    className
  );

  // Render different spinner variants
  if (variant === "dots") {
    // Dots loading spinner
    const dotSizeClasses = {
      xs: "h-1 w-1 mx-0.5",
      sm: "h-1.5 w-1.5 mx-0.5",
      md: "h-2 w-2 mx-1",
      lg: "h-3 w-3 mx-1",
      xl: "h-4 w-4 mx-1.5",
    };

    const dotColor =
      color === "theme"
        ? isPro
          ? "bg-yellow-500"
          : "bg-blue-600"
        : color === "white"
        ? "bg-white"
        : color === "gray"
        ? "bg-gray-600"
        : "bg-blue-600";

    return (
      <div
        className={containerClasses}
        role="status"
        aria-label={label}
        {...props}
      >
        <div className="flex">
          <div
            className={cn(
              "rounded-full animate-[bounce_0.7s_infinite_0s]",
              dotSizeClasses[size] || dotSizeClasses.md,
              dotColor
            )}
          ></div>
          <div
            className={cn(
              "rounded-full animate-[bounce_0.7s_infinite_0.1s]",
              dotSizeClasses[size] || dotSizeClasses.md,
              dotColor
            )}
          ></div>
          <div
            className={cn(
              "rounded-full animate-[bounce_0.7s_infinite_0.2s]",
              dotSizeClasses[size] || dotSizeClasses.md,
              dotColor
            )}
          ></div>
        </div>
        <span className="sr-only">{label}</span>
      </div>
    );
  } else if (variant === "grow") {
    // Grow spinner (pulsing circle)
    const growSizeClasses = {
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    const growColor =
      color === "theme"
        ? isPro
          ? "bg-yellow-500"
          : "bg-blue-600"
        : color === "white"
        ? "bg-white"
        : color === "gray"
        ? "bg-gray-600"
        : "bg-blue-600";

    return (
      <div
        className={containerClasses}
        role="status"
        aria-label={label}
        {...props}
      >
        <div
          className={cn(
            "animate-pulse rounded-full opacity-75",
            growSizeClasses[size] || growSizeClasses.md,
            growColor
          )}
        ></div>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // Default border spinner
  return (
    <div
      className={containerClasses}
      role="status"
      aria-label={label}
      {...props}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent",
          sizeStyles[size] || sizeStyles.md,
          colorStyles[color] || colorStyles.theme,
          borderStyle
        )}
      ></div>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;

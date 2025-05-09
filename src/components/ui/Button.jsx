// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\ui\Button.jsx
import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useProTheme } from "../../utils/useProTheme";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Button component with different variants and theme support
 *
 * Props:
 * @param {ReactNode} children - The content of the button
 * @param {string} type - Button type: "button", "submit", "reset"
 * @param {string} variant - Button style variant: "primary", "secondary", "outline", "danger", "ghost", "theme", "link"
 * @param {string} size - Button size: "xs", "sm", "md", "lg", "xl"
 * @param {string} className - Additional CSS classes
 * @param {boolean} fullWidth - Whether the button should take full width
 * @param {boolean} isLoading - Whether to show a loading spinner
 * @param {ReactNode} leftIcon - Icon to display on the left
 * @param {ReactNode} rightIcon - Icon to display on the right
 * @param {boolean} isActive - Whether the button is in an active state
 * @param {boolean} withRipple - Whether to add a ripple effect on click
 *
 * Usage:
 * <Button variant="theme" size="lg" isLoading={submitting} fullWidth leftIcon={<Icon />}>
 *   Submit
 * </Button>
 */
export const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      className = "",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      isActive = false,
      withRipple = false,
      ...props
    },
    ref
  ) => {
    const { isPro, theme } = useProTheme();

    // Base styles for all buttons
    const baseStyles =
      "font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";
    // Variant-specific styles with theme support
    const variantStyles = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300 shadow-sm",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100",
      outline:
        "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-500",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 shadow-sm",
      ghost:
        "bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700",
      link: "bg-transparent text-blue-600 hover:underline focus:ring-0 p-0 h-auto",
      // Theme variant (only blue theme now)
      theme:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300 shadow-sm",
    };

    // Size styles with appropriate spacing
    const sizeStyles = {
      xs: "text-xs px-2 py-1 h-6",
      sm: "text-sm px-3 py-1.5 h-8",
      md: "text-base px-4 py-2 h-10",
      lg: "text-lg px-5 py-2.5 h-12",
      xl: "text-xl px-6 py-3 h-14",
    };

    // Active state styles
    const activeStyles = isActive
      ? variant === "outline"
        ? "bg-gray-200 border-gray-400"
        : variant === "ghost"
        ? "bg-gray-200"
        : ""
      : "";

    // Full width style
    const widthStyle = fullWidth ? "w-full" : "";

    // Special handling for link variant
    const linkStyles = variant === "link" ? "font-normal" : "";

    // Combined className for the button
    const buttonClassName = cn(
      baseStyles,
      variantStyles[variant] || variantStyles.primary,
      sizeStyles[size] || sizeStyles.md,
      widthStyle,
      activeStyles,
      linkStyles,
      {
        "opacity-80 cursor-not-allowed": props.disabled,
        "cursor-wait": isLoading,
      },
      className
    );

    // Handle ripple effect
    const rippleEffect = withRipple
      ? {
          onClick: (e) => {
            const button = e.currentTarget;
            const ripple = document.createElement("span");
            const rect = button.getBoundingClientRect();

            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.className =
              "absolute bg-white bg-opacity-30 rounded-full pointer-events-none transform-gpu scale-0 animate-ripple";

            button.appendChild(ripple);

            setTimeout(() => {
              ripple.remove();
              props.onClick?.(e);
            }, 600);
          },
        }
      : {};

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassName}
        disabled={isLoading || props.disabled}
        {...rippleEffect}
        {...props}
      >
        {isLoading && (
          <LoadingSpinner
            size={size === "xs" ? "xs" : size === "sm" ? "sm" : "md"}
            className="mr-2"
            color={
              variant === "outline" || variant === "ghost" || variant === "link"
                ? "blue"
                : "white"
            }
          />
        )}

        {!isLoading && leftIcon && (
          <span
            className={cn("mr-2 inline-flex", {
              "text-lg": size === "lg" || size === "xl",
              "text-base": size === "md",
              "text-sm": size === "sm" || size === "xs",
            })}
          >
            {leftIcon}
          </span>
        )}

        {children}

        {rightIcon && (
          <span
            className={cn("ml-2 inline-flex", {
              "text-lg": size === "lg" || size === "xl",
              "text-base": size === "md",
              "text-sm": size === "sm" || size === "xs",
            })}
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * Button Group Component
 *
 * A container for grouping related buttons with consistent spacing and optional dividers.
 *
 * Props:
 * @param {ReactNode} children - The buttons to group
 * @param {string} variant - Group style: "row" or "stack"
 * @param {boolean} attached - Whether buttons should be attached with shared borders
 * @param {string} spacing - Custom spacing between buttons (when not attached)
 * @param {string} className - Additional CSS classes
 */
export const ButtonGroup = ({
  children,
  variant = "row",
  attached = false,
  spacing = 2,
  className = "",
  ...props
}) => {
  const groupClassName = cn(
    "flex",
    {
      "flex-row": variant === "row",
      "flex-col": variant === "stack",
      "space-x-2": variant === "row" && !attached && spacing === 2,
      "space-x-4": variant === "row" && !attached && spacing === 4,
      "space-y-2": variant === "stack" && !attached && spacing === 2,
      "space-y-4": variant === "stack" && !attached && spacing === 4,
      "divide-x divide-gray-300": variant === "row" && attached,
      "divide-y divide-gray-300": variant === "stack" && attached,
      "-space-x-px": variant === "row" && attached,
      "-space-y-px": variant === "stack" && attached,
    },
    className
  );

  // Apply special styles to child buttons when attached
  const childrenWithProps = attached
    ? React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;

          let roundedClasses = "";
          if (variant === "row") {
            roundedClasses = cn({
              "rounded-r-none": !isLast,
              "rounded-l-none": !isFirst && !isLast,
              "rounded-l-none border-l-0": !isFirst && isLast,
            });
          } else {
            roundedClasses = cn({
              "rounded-b-none": !isLast,
              "rounded-t-none": !isFirst && !isLast,
              "rounded-t-none border-t-0": !isFirst && isLast,
            });
          }

          return React.cloneElement(child, {
            className: cn(child.props.className, roundedClasses),
          });
        }
        return child;
      })
    : children;

  return (
    <div className={groupClassName} role="group" {...props}>
      {childrenWithProps}
    </div>
  );
};

export default Button;

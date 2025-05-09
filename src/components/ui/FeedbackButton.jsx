import React, { useState } from "react";
import Button from "./Button";
import FeedbackModal from "./FeedbackModal";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

/**
 * FeedbackButton component - displays a button that opens the feedback form
 * @param {Object} props
 * @param {string} [props.variant="primary"] - Button variant
 * @param {string} [props.size="md"] - Button size
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.isFloating=false] - Whether button should be floating
 * @param {string} [props.label="Feedback"] - Button label text
 */
const FeedbackButton = ({
  variant = "primary",
  size = "md",
  className = "",
  isFloating = false,
  label = "Feedback",
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const isPro = profile?.pro_user;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isFloating) {
    return (
      <>
        <button
          onClick={openModal}
          className={`fixed bottom-20 right-4 z-30 shadow-lg rounded-full p-3 focus:outline-none focus:ring-2 ${
            isPro
              ? "bg-gradient-to-tr from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:ring-yellow-400"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          } ${className}`}
          aria-label="Provide Feedback"
          {...props}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
            />
          </svg>
        </button>
        <FeedbackModal isOpen={isModalOpen} onClose={closeModal} />
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={openModal}
        leftIcon={
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
            />
          </svg>
        }
        {...props}
      >
        {label}
      </Button>
      <FeedbackModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default FeedbackButton;
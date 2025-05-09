import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHelpCircle, FiArrowRight, FiCamera, FiMessageSquare, FiFileText, FiBell, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { AnalyticsTracker } from '../../utils/analyticsTracker';

// This component will show progressive fullscreen tutorial cards to new users
const ToolTipsGuide = ({ onComplete, isManuallyTriggered = false }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [direction, setDirection] = useState(0); // For animation direction
  
  // Touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    // Minimum swipe distance (px) to trigger navigation
    const minSwipeDistance = 50;
    
    if (swipeDistance > minSwipeDistance && currentStep > 0) {
      // Swiped right, go to previous
      handlePrevStep();
    } else if (swipeDistance < -minSwipeDistance && currentStep < tutorialSteps.length - 1) {
      // Swiped left, go to next
      handleNextStep();
    }
  };

  // Track each feature tutorial view in analytics
  const trackTooltipView = async (featureId) => {
    await AnalyticsTracker.trackTooltipView(featureId);
  };
  
  // Tutorial steps as full-screen swipe cards
  const tutorialSteps = [
    {
      id: 'scan-button',
      title: 'Scan Medications',
      description: 'Use your camera to scan medication labels, prescriptions, and pill bottles to get instant information about your medications.',
      icon: <FiCamera className="w-12 h-12 text-blue-500" />,
      color: 'from-blue-400 to-blue-500'
    },
    {
      id: 'chat-button',
      title: 'Ask Medical Questions',
      description: 'Have questions about your medications? Chat with MediScan to get information on dosages, side effects, and drug interactions.',
      icon: <FiMessageSquare className="w-12 h-12 text-green-500" />,
      color: 'from-green-400 to-green-500'
    },
    {
      id: 'health-records',
      title: 'Track Health Records',
      description: 'Easily track your medication history, prescriptions, and health records all in one secure place.',
      icon: <FiFileText className="w-12 h-12 text-purple-500" />,
      color: 'from-purple-400 to-purple-500'
    },
    {
      id: 'notifications',
      title: 'Set Medication Reminders',
      description: 'Never miss a dose again! Set up reminders for your medications and get important updates about your health.',
      icon: <FiBell className="w-12 h-12 text-yellow-500" />,
      color: 'from-yellow-400 to-yellow-500'
    }
  ];
    useEffect(() => {
    // Track first step view on mount
    if (tutorialSteps.length > 0) {
      trackTooltipView(tutorialSteps[0].id);
    }
    
    // Only hide based on localStorage if this is being shown during initial onboarding
    // If manually triggered, we want to show it regardless of onboarding status
    if (!onComplete) {
      // Check if user has completed onboarding already
      const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
      if (onboardingComplete) {
        setVisible(false);
      }
    }
  }, [onComplete]);
  
  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setDirection(1); // Forward animation
      const nextStep = currentStep + 1;
      setTimeout(() => {
        setCurrentStep(nextStep);
        trackTooltipView(tutorialSteps[nextStep].id);
      }, 50);
    } else {
      // Last step reached, complete onboarding
      handleComplete();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setDirection(-1); // Backward animation
      const prevStep = currentStep - 1;
      setTimeout(() => {
        setCurrentStep(prevStep);
        trackTooltipView(tutorialSteps[prevStep].id);
      }, 50);
    }
  };
    const handleComplete = async () => {
    // Only mark onboarding as complete if this is the initial onboarding flow
    if (!isManuallyTriggered) {
      // Mark onboarding as complete in localStorage
      localStorage.setItem('onboardingComplete', 'true');
      
      // Record completion in analytics
      await AnalyticsTracker.trackEvent('onboarding_complete', { 
        completed_at: new Date().toISOString() 
      });
    } else {
      // If manually triggered, track a different event
      await AnalyticsTracker.trackEvent('tutorial_viewed', { 
        completed_at: new Date().toISOString(),
        source: 'how_to_use_page'
      });
    }
    
    // Hide card and notify parent
    setVisible(false);
    if (onComplete) onComplete();
  };
  
  const handleSkip = () => {
    // Only mark as skipped if this is the initial onboarding flow
    if (!isManuallyTriggered) {
      // Mark as viewed but not necessarily completed
      localStorage.setItem('onboardingSkipped', 'true');
      
      // Track skip in analytics
      AnalyticsTracker.trackEvent('onboarding_skipped', { 
        skipped_at: new Date().toISOString() 
      });
    } else {
      // If manually triggered, track a different event
      AnalyticsTracker.trackEvent('tutorial_skipped', { 
        skipped_at: new Date().toISOString(),
        source: 'how_to_use_page'
      });
    }
    
    setVisible(false);
    if (onComplete) onComplete();
  };
    // If tutorial has been completed or skipped, don't show
  if (!visible) {
    return null;
  }
  
  const currentFeature = tutorialSteps[currentStep];
  
  // Determine button label based on whether this is initial onboarding or manually triggered
  const finalButtonLabel = isManuallyTriggered ? 'Close Tutorial' : 'Get Started';
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        
        {/* Tutorial Card */}
        <motion.div
          key={currentStep}
          className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md mx-auto overflow-hidden"
          initial={{ 
            opacity: 0, 
            x: direction === 1 ? 100 : direction === -1 ? -100 : 0
          }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ 
            opacity: 0, 
            x: direction === 1 ? -100 : direction === -1 ? 100 : 0
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Skip button */}
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 text-white bg-gray-700 bg-opacity-50 rounded-full p-1.5 hover:bg-opacity-70" 
            aria-label="Skip tutorial"
          >
            <FiX className="w-4 h-4" />
          </button>

          {/* Progress indicators */}
          <div className="absolute top-3 left-0 right-0 flex justify-center space-x-1.5 z-10">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-6 bg-white' 
                    : 'w-3 bg-white bg-opacity-40'
                }`}
              />
            ))}
          </div>
          
          {/* Header with gradient */}
          <div className={`bg-gradient-to-br ${currentFeature.color} p-8 pt-12 flex flex-col items-center text-white`}>
            <div className="rounded-full bg-white bg-opacity-20 p-5 mb-4">
              {currentFeature.icon}
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              {currentFeature.title}
            </h2>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 text-center mb-8">
              {currentFeature.description}
            </p>
            
            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              {currentStep > 0 ? (
                <button
                  onClick={handlePrevStep}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <FiChevronLeft className="mr-1 w-5 h-5" />
                  Back
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}
              
              <button
                onClick={handleNextStep}                className={`flex items-center justify-center px-6 py-2.5 rounded-lg font-medium ${
                  currentStep < tutorialSteps.length - 1
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {currentStep < tutorialSteps.length - 1 ? 'Next' : finalButtonLabel}
                {currentStep < tutorialSteps.length - 1 && (
                  <FiChevronRight className="ml-1 w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Swipe indicators (mobile) */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center text-xs text-gray-500">
            <span>Swipe to navigate</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToolTipsGuide;

import React, { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import ToolTipsGuide from '../onboarding/ToolTipsGuide';
import { AnalyticsTracker } from '../../utils/analyticsTracker';

// A reusable tutorial button that can be used across the app to trigger the tutorial
const TutorialButton = ({ position = 'bottom-right', colorScheme = 'blue' }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  const handleTutorialClick = () => {
    setShowTutorial(true);
    AnalyticsTracker.trackEvent('tutorial_triggered', {
      from: 'tutorial_button',
      location: window.location.pathname
    });
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  // Determine position classes
  let positionClasses = '';
  switch (position) {
    case 'top-right':
      positionClasses = 'top-20 right-4';
      break;
    case 'top-left':
      positionClasses = 'top-20 left-4';
      break;
    case 'bottom-left':
      positionClasses = 'bottom-20 left-4';
      break;
    case 'bottom-right':
    default:
      positionClasses = 'bottom-20 right-4';
      break;
  }

  // Determine color classes
  let colorClasses = '';
  switch (colorScheme) {
    case 'green':
      colorClasses = 'bg-green-500 hover:bg-green-600 text-white';
      break;
    case 'yellow':
      colorClasses = 'bg-yellow-500 hover:bg-yellow-600 text-white';
      break;
    case 'purple':
      colorClasses = 'bg-purple-500 hover:bg-purple-600 text-white';
      break;
    case 'blue':
    default:
      colorClasses = 'bg-blue-500 hover:bg-blue-600 text-white';
      break;
  }

  return (
    <>
      <button
        onClick={handleTutorialClick}
        className={`fixed ${positionClasses} z-40 ${colorClasses} rounded-full p-3 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        aria-label="Show app tutorial"
      >
        <FiHelpCircle className="w-6 h-6" />
      </button>

      {showTutorial && (
        <ToolTipsGuide
          onComplete={handleTutorialComplete}
          isManuallyTriggered={true}
        />
      )}
    </>
  );
};

export default TutorialButton;

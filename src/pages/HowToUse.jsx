import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHelpCircle, FiTarget, FiBookOpen, FiFileText, FiImage, FiMessageSquare, FiActivity, FiPlay, FiLayers } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useProTheme } from "../utils/useProTheme";
import { ROUTES, STORAGE_KEYS } from "../utils/constants";
import { withErrorBoundary } from "../components/ui/ErrorBoundary";
import Card, { CardHeader, CardContent } from "../components/ui/Card";
import FeedbackButton from "../components/ui/FeedbackButton";
import { supabase } from "../lib/supabase";
import { AnalyticsTracker } from "../utils/analyticsTracker";
import ToolTipsGuide from "../components/onboarding/ToolTipsGuide";
import TutorialButton from "../components/ui/TutorialButton";

function HowToUse() {
  const { t, i18n } = useTranslation('howToUse'); // Using 'howToUse' namespace
  const navigate = useNavigate();
  const { theme } = useProTheme();
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showTutorialCards, setShowTutorialCards] = useState(false);

  // Toggle tutorial cards visibility
  const handleToggleTutorialCards = () => {
    setShowTutorialCards(true);
    // Track this interaction
    AnalyticsTracker.trackEvent('tutorial_cards_opened', {
      from: 'how_to_use_page',
      timestamp: new Date().toISOString()
    });
  };

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setShowTutorialCards(false);
  };

  // Check if translations are ready
  const ready = i18n.isInitialized && i18n.hasResourceBundle(i18n.language, 'howToUse');

  // Get user data and check if they are new
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Check if this is a new user by checking localStorage
        const isFirstLogin = localStorage.getItem(STORAGE_KEYS.FIRST_LOGIN) === 'true';
        setIsNewUser(isFirstLogin);
      }
    };
    
    getUserData();
  }, []);  // Scroll to top when component mounts and track viewed status
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Mark that user has viewed the how-to-use page
    localStorage.setItem('howToUseViewed', 'true');
    
    // Track tutorial view in analytics
    AnalyticsTracker.trackTutorialView();
    
    // Update the first_login flag in the database if user is logged in
    const updateFirstLoginStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ first_login: false })
          .eq('id', user.id);
          
        // Create a welcome notification
        try {
          await supabase
            .from("notifications")
            .insert([{
              user_id: user.id,
              title: "Welcome to MediScan!",
              message: "Thank you for joining MediScan. We're excited to help you manage your medications and health more effectively.",
              type: "welcome",
              is_read: false
            }]);
        } catch (error) {
          console.error("Error creating welcome notification:", error);
        }
      }
    };
    
    updateFirstLoginStatus();
  }, []);

  const howToUseSections = [
    {
      id: "scanning",
      title: t('sections.scanning.title'),
      description: t('sections.scanning.description'),
      icon: <FiImage className="w-6 h-6 text-blue-500" />,
      steps: [
        {
          title: t('sections.scanning.steps.step1.title'),
          description: t('sections.scanning.steps.step1.description'),
        },
        {
          title: t('sections.scanning.steps.step2.title'),
          description: t('sections.scanning.steps.step2.description'),
        },
        {
          title: t('sections.scanning.steps.step3.title'),
          description: t('sections.scanning.steps.step3.description'),
        },
        {
          title: t('sections.scanning.steps.step4.title'),
          description: t('sections.scanning.steps.step4.description'),
        }
      ]
    },
    {
      id: "chatting",
      title: t('sections.chatting.title'),
      description: t('sections.chatting.description'),
      icon: <FiMessageSquare className="w-6 h-6 text-green-500" />,
      steps: [
        {
          title: t('sections.chatting.steps.step1.title'),
          description: t('sections.chatting.steps.step1.description'),
        },
        {
          title: t('sections.chatting.steps.step2.title'),
          description: t('sections.chatting.steps.step2.description'),
        },
        {
          title: t('sections.chatting.steps.step3.title'),
          description: t('sections.chatting.steps.step3.description'),
        },
        {
          title: t('sections.chatting.steps.step4.title'),
          description: t('sections.chatting.steps.step4.description'),
        }
      ]
    },
    {
      id: "health-records",
      title: t('sections.healthRecords.title'),
      description: t('sections.healthRecords.description'),
      icon: <FiActivity className="w-6 h-6 text-red-500" />,
      steps: [
        {
          title: t('sections.healthRecords.steps.step1.title'),
          description: t('sections.healthRecords.steps.step1.description'),
        },
        {
          title: t('sections.healthRecords.steps.step2.title'),
          description: t('sections.healthRecords.steps.step2.description'),
        },
        {
          title: t('sections.healthRecords.steps.step3.title'),
          description: t('sections.healthRecords.steps.step3.description'),
        },
        {
          title: t('sections.healthRecords.steps.step4.title'),
          description: t('sections.healthRecords.steps.step4.description'),
        }
      ]
    },
    {
      id: "mediscan-gold",
      title: t('sections.gold.title'),
      description: t('sections.gold.description'),
      icon: <FiTarget className="w-6 h-6 text-yellow-500" />,
      steps: [
        {
          title: t('sections.gold.steps.step1.title'),
          description: t('sections.gold.steps.step1.description'),
        },
        {
          title: t('sections.gold.steps.step2.title'),
          description: t('sections.gold.steps.step2.description'),
        },
        {
          title: t('sections.gold.steps.step3.title'),
          description: t('sections.gold.steps.step3.description'),
        },
        {
          title: t('sections.gold.steps.step4.title'),
          description: t('sections.gold.steps.step4.description'),
        }
      ]
    }
  ];

  // If translations aren't ready yet, show a simple loading text
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b sticky top-0 z-10">
        <div className="flex items-center space-x-4 max-w-2xl mx-auto">
          <Link to={user ? ROUTES.HOME : ROUTES.AUTH} className="text-gray-700 hover:text-gray-900">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">
            {t('title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Introduction */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <div className="flex items-center mb-4">
            <FiBookOpen className="w-7 h-7 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold">{t('introduction.title')}</h2>
          </div>
          <p className="text-gray-700 mb-3">
            {t('introduction.description')}
          </p>          <p className="text-gray-700">
            {t('introduction.guide')}
          </p>
          {isNewUser && (
            <motion.div 
              className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 0.2,
                ease: "easeOut"
              }}
            >
              <motion.p 
                className="text-blue-700 font-medium"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Welcome to MediScan! Since this is your first time, we've prepared this guide to help you get started.
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* How to Use Sections */}
        {howToUseSections.map((section) => (
          <div key={section.id} className="mb-6">
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <div>
                    <h3 className="text-lg font-medium">{section.title}</h3>
                    <p className="text-sm text-gray-500">
                      {section.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.steps.map((step, index) => (
                    <div key={index} className="flex">                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 text-blue-700">
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

      {/* Tutorial cards component */}
      {showTutorialCards && (
        <ToolTipsGuide 
          onComplete={handleTutorialComplete}
          isManuallyTriggered={true}
        />
      )}        {/* Tutorial Button */}
        <div className="fixed bottom-5 right-5">
          <TutorialButton position="bottom-right" colorScheme="purple" />
        </div>

        {/* Additional Help Section */}
        <Card className="mb-6 p-6">
          <div className="flex items-center mb-4">
            <FiHelpCircle className="w-6 h-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-semibold">{t('additionalHelp.title')}</h3>
          </div>
          <p className="text-gray-700 mb-4">
            {t('additionalHelp.description')}
          </p>
          <div className="space-y-3">
            <Link to="/about-creators" className="block text-blue-600 hover:underline">
              • {t('additionalHelp.aboutCreators')}
            </Link>
            <a href="mailto:support@mediscan.app" className="block text-blue-600 hover:underline">
              • {t('additionalHelp.contact')}
            </a>
            <Link to="#" className="block text-blue-600 hover:underline">
              • {t('additionalHelp.faq')}
            </Link>
          </div>
        </Card>

        {/* Interactive Tutorial Card */}
        {/* <Card className="mb-6 overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center space-x-3">
              <FiPlay className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-lg font-medium">Interactive Tutorial</h3>
                <p className="text-sm text-blue-100">
                  Learn the app through visual cards
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <FiLayers className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-3">
                  Get a quick visual tour of MediScan's key features through our interactive cards.
                  Perfect for visual learners or if you prefer a step-by-step guide.
                </p>
                <button
                  onClick={handleToggleTutorialCards}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center"
                >
                  <FiPlay className="mr-2" />
                  Start Interactive Tutorial
                </button>
              </div>
            </div>
          </CardContent>
        </Card> */}
        
        {/* Feedback Button */}
        <div className="mb-6">
          <FeedbackButton 
            variant="theme"
            size="lg"
            className="w-full py-4"
            label={t('feedbackButton')}
          />
        </div>
          {/* Get Started Button for new users */}
        <div className="mb-10">
          <button 
            onClick={() => {
              AnalyticsTracker.trackTutorialComplete();
              navigate(ROUTES.HOME);
            }}            className="w-full py-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg transition duration-200"
          >
            {t('getStartedButton', 'Get Started with MediScan')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(HowToUse, {
  errorKey: 'how-to-use-page'
});

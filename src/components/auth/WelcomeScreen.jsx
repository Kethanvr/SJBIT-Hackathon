import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsQrCodeScan } from 'react-icons/bs';
import { FiActivity, FiHeart } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';

// Inline styles for custom animations (Consider moving to a CSS file)
const customStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes floatSlow {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  @keyframes floatMedium {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(-5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite; /* Adjusted duration back for smoother float */
  }
  
  .animate-float-slow {
    animation: floatSlow 8s ease-in-out infinite; /* Adjusted duration back */
  }
  
  .animate-float-medium {
    animation: floatMedium 7s ease-in-out infinite; /* Adjusted duration back */
  }
`;

// Welcome messages in different languages
const welcomeMessages = [
  { lang: "en", language: "English", title: "MediScan", message: "Hello, Welcome" },
  { lang: "kn", language: "Kannada", title: "ಮೆಡಿಸ್ಕ್ಯಾನ್", message: "ನಮಸ್ಕಾರ, ಸುಸ್ವಾಗತ" }, // Updated message
  { lang: "ta", language: "Tamil", title: "மெடிஸ்கேன்", message: "வணக்கம், வரவேற்கிறோம்" }, // Updated message
  { lang: "te", language: "Telugu", title: "మెడిస్కాన్", message: "నమస్కారం, స్వాగతం" }, // Updated message
  { lang: "ml", language: "Malayalam", title: "മെഡിസ്കാൻ", message: "ഹലോ, സ്വാഗതം" }, // Updated message
  { lang: "hi", language: "Hindi", title: "मेडिस्कैन", message: "नमस्ते, स्वागत है" } // Updated message
  // { lang: "es", language: "Spanish", title: "MediScan", message: "Hola, Bienvenido" },
  // { lang: "fr", language: "French", title: "MediScan", message: "Bonjour, Bienvenue" }
];

export default function WelcomeScreen({ onComplete }) {
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [isPro, setIsPro] = useState(() => {
    try {
      return localStorage.getItem('pro_user') === 'true';
    } catch {
      return false;
    }
  });

  // Add custom animation styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Effect to handle language transitions (starts automatically)
  useEffect(() => {
    let languageTimer;
    
    languageTimer = setTimeout(() => {
      if (currentLanguage < welcomeMessages.length - 1) {
        setCurrentLanguage(currentLanguage + 1);
      } else {
        // Signal completion to the parent component
        if (onComplete) {
          onComplete();
        }
      }
    }, 960); // Time each language is shown
    
    return () => clearTimeout(languageTimer);
  // Dependency array updated: runs when currentLanguage changes or onComplete changes
  }, [currentLanguage, onComplete]); 

  // On mount, verify pro status with supabase and update localStorage and state
  useEffect(() => {
    async function verifyProStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch profile from supabase
          let { data: profile } = await supabase
            .from('profiles')
            .select('pro_user')
            .eq('id', user.id)
            .single();
          if (profile && typeof profile.pro_user === 'boolean') {
            setIsPro(profile.pro_user);
            localStorage.setItem('pro_user', profile.pro_user ? 'true' : 'false');
          }
        }
      } catch (e) {
        // fallback: do nothing
      }
    }
    verifyProStatus();
  }, []);

  return (
    <motion.div 
      className={`absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b ${isPro ? 'from-yellow-400 to-yellow-200' : 'from-blue-900 to-blue-700'}`}
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.7, ease: "easeInOut" }
      }}
    >
      <div className="absolute inset-0">
        {/* Subtle background pattern/effect if desired */}
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
        {/* Floating medical icons */}
        <div className="absolute top-1/4 left-1/4 animate-float-slow opacity-30">
          <BsQrCodeScan className={`text-6xl ${isPro ? 'text-yellow-200' : 'text-blue-300'}`} />
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float-medium opacity-30">
          <FiActivity className={`text-7xl ${isPro ? 'text-yellow-200' : 'text-blue-300'}`} />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float opacity-30">
          <FiHeart className={`text-5xl ${isPro ? 'text-yellow-200' : 'text-blue-300'}`} />
        </div>
      </div>
      
      <div className="text-center z-10 px-6">
        {/* Central Logo - Animation now runs continuously until exit */}
        <motion.div
          className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        >
          <BsQrCodeScan className="text-4xl text-white" />
        </motion.div>
        
        {/* Language Text Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLanguage}
            className="h-32 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Display Translated Title */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3"
            >
              {welcomeMessages[currentLanguage].title} 
            </motion.h1>
            {/* Display Welcome Message */}
            <motion.h2 
              className={`text-lg font-medium ${isPro ? 'text-yellow-100' : 'text-blue-200'}`}
            >
              {welcomeMessages[currentLanguage].message}
            </motion.h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

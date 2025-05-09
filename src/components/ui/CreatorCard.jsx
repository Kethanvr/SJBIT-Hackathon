import React from 'react';
import { FiLinkedin, FiGithub, FiTwitter, FiYoutube } from 'react-icons/fi';
import { SiThreads, SiDiscord } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProTheme } from '../../utils/useProTheme';

/**
 * CreatorCard component for displaying creator information
 */
const CreatorCard = ({   creator, 
  isDetailed = false, 
  onClick = null
}) => {
  const { t } = useTranslation('creator');
  const { isPro } = useProTheme();
  const { 
    id, 
    name, 
    role, 
    profilePic, 
    shortBio, 
    fullBio, 
    socialLinks 
  } = creator;

  // Format bio text with proper paragraph breaks
  const formatBioText = (text) => {
    if (!text) return '';
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
    ));
  };

  // Render social icons based on platform with consistent styling and colors
  const renderSocialIcon = (platform) => {
    const iconClass = "w-5 h-5";
    
    switch (platform.toLowerCase()) {
      case 'github':
        return <FiGithub className={iconClass} />;
      case 'linkedin':
        return <FiLinkedin className={iconClass} />;
      case 'youtube':
        return <FiYoutube className={iconClass} />;
      case 'twitter':
      case 'x':
        return <FiTwitter className={iconClass} />;
      case 'threads':
        return <SiThreads className={iconClass} />;
      case 'discord':
        return <SiDiscord className={iconClass} />;
      default:
        return null;
    }
  };
  
  // Get platform color for social buttons
  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github': return 'bg-gray-800 text-white hover:bg-gray-700';
      case 'linkedin': return 'bg-blue-700 text-white hover:bg-blue-600';
      case 'youtube': return 'bg-red-600 text-white hover:bg-red-500';
      case 'twitter':
      case 'x': return 'bg-black text-white hover:bg-gray-800';
      case 'threads': return 'bg-black text-white hover:bg-gray-800';
      case 'discord': return 'bg-indigo-600 text-white hover:bg-indigo-500';
      default: return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  // Simple card view for the list page
  if (!isDetailed) {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer"
        onClick={onClick ? () => onClick(id) : undefined}
      >
        <div className="flex items-center space-x-4">
          <img 
            src={profilePic} 
            alt={`${name}'s profile`} 
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
          />          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
            <p className={`${isPro ? 'text-yellow-600' : 'text-blue-600'} text-sm font-medium`}>{role}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{shortBio}</p>
          </div>
        </div>
        <div className="mt-4 text-right">          <span className={`${isPro ? 'text-yellow-600' : 'text-blue-600'} text-sm font-medium flex items-center justify-end`}>
            {t('viewProfile')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    );
  }
  // Detailed view for individual creator page
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header background with gradient - increased height for better profile placement */}
      <div className={`bg-gradient-to-r ${isPro ? 'from-yellow-500 to-yellow-400' : 'from-blue-600 to-blue-400'} h-40 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
      </div>
      
      <div className="px-6 pt-0 pb-8">
        {/* Improved positioning to prevent overlap */}
        <div className="flex flex-col items-center relative -mt-20">
          {/* Profile image with improved container and better positioning */}
          <div className="rounded-full p-1 bg-white shadow-lg">
            <img 
              src={profilePic} 
              alt={`${name}'s profile`} 
              className="w-28 h-28 rounded-full object-cover border-4 border-white"
              loading="eager" // Ensures image loads quickly
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/assests/Mediscan-qr.jpg';
              }} // Fallback for failed image loads
            />
          </div>          
          {/* Name and role */}
          <h2 className="mt-5 font-bold text-2xl text-gray-800">{name}</h2>
          <p className={`${isPro ? 'text-yellow-600' : 'text-blue-600'} font-medium`}>{role}</p>
          
          {/* Bio section with better mobile spacing */}
          <div className="mt-8 space-y-4 text-left max-w-md w-full px-2 sm:px-0">
            <div className="prose prose-sm sm:prose text-gray-700 leading-relaxed">
              {formatBioText(fullBio || shortBio)}
            </div>
          </div>
          
          {/* Social Links Section with better mobile layout */}
          <div className="mt-8 w-full max-w-md px-2 sm:px-0">            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
              {t('connectWithMe')}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {socialLinks?.map((link) => (
                <a 
                  key={link.platform} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all transform hover:scale-105 ${getPlatformColor(link.platform)}`}
                  aria-label={`Visit ${link.platform}`}
                >
                  <span className="flex-shrink-0">{renderSocialIcon(link.platform)}</span>
                  <span className="text-xs sm:text-sm font-medium truncate">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
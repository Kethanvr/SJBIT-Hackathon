import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCode, FiHeart } from 'react-icons/fi';
import CreatorCard from '../components/ui/CreatorCard';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { withErrorBoundary } from '../components/ui/ErrorBoundary';
import { ROUTES } from '../utils/constants';
import { useProTheme } from '../utils/useProTheme';

// Creator data - Keep as is, assuming CreatorCard handles internal translation if needed
const CREATORS = [
  {
    id: 'kethan',
    name: 'Kethan VR',
    role: 'Founder & Lead Developer',
    profilePic: 'https://media.licdn.com/dms/image/v2/D4D03AQHs5yDObbymdw/profile-displayphoto-shrink_400_400/B4DZV1yJd8HkAg-/0/1741437837607?e=1749081600&v=beta&t=7d07K_qEtX1A0D0rmhRXrBBNeV-JkHQ4nqG0za39aWI',
    shortBio: 'Engineering Student at CMR Institute of Technology, passionate about using tech to create real-world impact.',
    fullBio: "Hey there! I'm Kethan VR, the creator of MediScan — an AI-powered app made with love and purpose 💙 I'm a Engineering Student at CMR Institute of Technology, Bangalore, passionate about using tech to create real-world impact.\n\nMediScan was born out of a mission: to make health info easy, accurate, and accessible for everyone. Whether it's scanning Medicine labels, checking for allergens, or monitoring compliance — my goal is to empower you to take control of your health with just a tap. I'm constantly learning and building — so expect MediScan to keep growing smarter, faster, and more helpful 🚀\nLet's make the world a little healthier, together 💪🩺",
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/Kethanvr' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/kethan-vr-433ab532b/' },
      { platform: 'YouTube', url: 'https://www.youtube.com/@kethanvr' },
      { platform: 'X', url: 'https://x.com/VrKethan' },
      { platform: 'Threads', url: 'https://www.threads.net/@kethan_vr_' },
      { platform: 'Discord', url: 'https://discord.gg/PcbfmP6j' }
    ]
  }
];

const AboutCreators = () => {  const { t, i18n } = useTranslation('aboutCreators'); // Initialize useTranslation, get i18n instance
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useProTheme(); // Get theme values

  // Check if translations are ready for the specified namespace
  const ready = i18n.isInitialized && i18n.hasResourceBundle(i18n.language, 'aboutCreators');


  const selectedCreator = id
    ? CREATORS.find(creator => creator.id === id)
    : null;

  // Scroll to top when component mounts or when route params change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Handle clicking on a creator card
  const handleCreatorClick = (creatorId) => {
    navigate(`/about-creators/${creatorId}`);
  };
  // Display loading state if translations are not ready
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading creator information..." />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <Link to={selectedCreator ? '/about-creators' : '/account'} className="mr-4">
            <FiArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-semibold">
            {selectedCreator ? selectedCreator.name : t('headerTitleList')}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl overflow-x-hidden">
        {selectedCreator ? (
          // Detailed creator view
          <div className="fade-in-animation">
            <CreatorCard
              creator={selectedCreator}
              isDetailed={true}
              // Pass t function or specific translations if CreatorCard needs them
            />
          </div>        ) : (
          // List view of all creators
          <div className="fade-in-animation">            {/* Hero section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-6 mb-8 text-white shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <FiHeart className="w-8 h-8 mb-3 sm:mb-0 sm:mr-3" />
                <h2 className="text-2xl font-bold">{t('heroTitle')}</h2>
              </div>
              <p className="text-blue-50 leading-relaxed">
                {t('heroDescription')}
              </p>
            </div>

            {/* Creator cards */}
            <div className="space-y-5">
              {CREATORS.map(creator => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  onClick={handleCreatorClick}
                  // Pass t function or specific translations if CreatorCard needs them
                />
              ))}
            </div>            {/* Call to action */}
            <div className="mt-10 bg-white rounded-xl p-6 border border-blue-100 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-start sm:items-center mb-4 sm:mb-0 w-full sm:w-auto">
                <FiCode className="text-blue-600 w-6 h-6 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">{t('ctaTitle')}</h3>
                  <p className="text-gray-600 text-sm">{t('ctaDescription')}</p>
                </div>
              </div>
              <a
                href="https://www.linkedin.com/in/kethan-vr-433ab532b/" // Keep external link
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto text-center"
              >
                {t('ctaButton')}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withErrorBoundary(AboutCreators, {
  errorKey: 'about-creators-page'
});
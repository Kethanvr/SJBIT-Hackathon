import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// RecommendCard component for individual recommendation cards
const RecommendCard = ({ 
  bgColor, 
  title, 
  description, 
  buttonText, 
  buttonColor, 
  linkTo, 
  onClick, 
  disabled = false 
}) => {
  const buttonClasses = disabled 
    ? "bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
    : `${buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium hover:${buttonColor.replace('bg-', 'bg-')}`;

  const card = (
    <div className={`flex-shrink-0 w-64 ${bgColor} rounded-xl p-4`}>
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            className={`mt-auto ${buttonClasses}`}
            disabled={disabled}
          >
            {buttonText}
          </button>
        ) : (
          <div className={`mt-auto ${buttonClasses} text-center`}>
            {buttonText}
          </div>
        )}
      </div>
    </div>
  );

  if (linkTo && !onClick && !disabled) {
    return (
      <Link to={linkTo} className="flex flex-col h-full">
        {card}
      </Link>
    );
  }

  return card;
};

const RecommendationsSection = ({ onStartNewChat }) => {
  const { t } = useTranslation("home");
  
  // Define the card data
  const cardData = [
    {
      id: "chat",
      bgColor: "bg-yellow-50",
      title: t('recommendations.chat.title'),
      description: t('recommendations.chat.description'),
      buttonText: t('recommendations.chat.button'),
      buttonColor: "bg-yellow-600",
      onClick: onStartNewChat
    },
    {
      id: "record",
      bgColor: "bg-teal-50",
      title: t('recommendations.record.title'),
      description: t('recommendations.record.description'),
      buttonText: t('recommendations.record.button'),
      buttonColor: "bg-teal-600",
      linkTo: "/health/records"
    },

    // Add coming soon cards with indices 1-3
    ...[1, 2, 3].map(index => ({
      id: `coming-soon-${index}`,
      bgColor: "bg-gray-50",
      title: t('recommendations.comingSoon.title'),
      description: t('recommendations.comingSoon.description'),
      buttonText: t('recommendations.comingSoon.button'),
      buttonColor: "bg-gray-200",
      disabled: true
    }))
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('recommendations.title')}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {cardData.map(card => (
          <RecommendCard 
            key={card.id}
            bgColor={card.bgColor}
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
            buttonColor={card.buttonColor}
            linkTo={card.linkTo}
            onClick={card.onClick}
            disabled={card.disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;

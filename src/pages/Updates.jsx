import React from "react";
import {
  FiArrowLeft,
  FiGift,
  FiZap,
  FiInfo,
  FiDollarSign,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { updates } from "../data/updatesData";
import { withErrorBoundary } from "../components/ui/ErrorBoundary";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useProTheme } from "../utils/useProTheme";
import { ROUTES } from "../utils/constants";
import FeedbackButton from "../components/ui/FeedbackButton";

// Helper to get icon based on type
const getIcon = (type) => {
  switch (type) {
    case "feature":
      return <FiGift className="w-5 h-5 text-white" />;
    case "improvement":
      return <FiZap className="w-5 h-5 text-white" />;
    case "fix":
      return <FiInfo className="w-5 h-5 text-white" />;
    default:
      return <FiGift className="w-5 h-5 text-white" />;
  }
};

// Helper to get background color based on type
const getIconBgColor = (type) => {
  switch (type) {
    case "feature":
      return "bg-gradient-to-tr from-yellow-400 to-yellow-600";
    case "improvement":
      return "bg-gradient-to-tr from-green-400 to-green-600";
    case "fix":
      return "bg-gradient-to-tr from-red-400 to-red-600";
    default:
      return "bg-gradient-to-tr from-blue-400 to-blue-600";
  }
};

const Updates = () => {
  const navigate = useNavigate();

  // Get theme support from our hook with safe fallback
  let proThemeProps = { isPro: false, theme: {} };
  try {
    // Safely use the theme hook
    const result = useProTheme();
    if (result) {
      proThemeProps = result;
    }
  } catch (error) {
    console.error("Error using ProTheme in Updates:", error);
    // Continue with defaults if the hook fails
  }

  const { isPro, theme } = proThemeProps;

  // Dynamic styling based on Pro status
  const headerTextColor = isPro ? "text-yellow-700" : "text-blue-700";
  const bgGradient = isPro
    ? "from-yellow-50 via-white to-yellow-50"
    : "from-blue-50 via-white to-blue-50";

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} px-4 py-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="relative flex items-center justify-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2"
            onClick={() => navigate(ROUTES.HOME)}
            aria-label="Go back"
            leftIcon={<FiArrowLeft className="w-6 h-6" />}
          />
          <h1
            className={`text-3xl font-extrabold text-center ${headerTextColor} tracking-tight drop-shadow`}
          >
            What's New
          </h1>
        </div>

        {/* KCoins Announcement Card */}
        <Card className="mb-10 bg-gradient-to-tr from-yellow-300 to-yellow-500 border-2 border-yellow-400">
          <Card.Content className="p-6 flex items-center gap-5 animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg">
              <FiDollarSign className="w-10 h-10 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-1">
                Introducing <span className="text-yellow-700">KCoins</span>!
              </h2>
              <p className="text-yellow-900 font-medium">
                Every scan now costs <span className="font-bold">1 KCoin</span>.
                Check your balance in your account or on the scanner page. Use
                referral code{" "}
                <span className="font-mono bg-yellow-200 px-2 py-1 rounded">
                  ******
                </span>{" "}
                for free coins!
                <br />
                Purchasing coins is launching soon—need more?{" "}
                <span className="underline">Contact the creator</span>.
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Timeline */}
        <div className="space-y-10 mb-16">
          {updates.map((update, idx) => (
            <div key={idx} className="flex items-start space-x-5">
              {/* Icon and Vertical Line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${getIconBgColor(
                    update.type
                  )}`}
                >
                  {getIcon(update.type)}
                </div>
                {/* Vertical line connecting items */}
                {idx < updates.length - 1 && (
                  <div className="w-1 flex-grow bg-gradient-to-b from-yellow-300 to-blue-200 mt-2"></div>
                )}
              </div>

              {/* Update Content */}
              <Card className="flex-1 pb-10 border-b-2 border-yellow-100 last:border-b-0 bg-transparent shadow-none">
                <Card.Content>
                  <p className="text-xs text-yellow-700 mb-1 font-semibold tracking-wide uppercase">
                    {update.date}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">
                    {update.title}
                  </h3>
                  <p className="text-gray-800 text-base leading-relaxed">
                    {update.description}
                  </p>
                </Card.Content>
              </Card>
            </div>
          ))}
        </div>

        {/* Under Development Notice Card */}
        <Card
          variant="outline"
          className="bg-blue-50 border-l-4 border-blue-400 p-7 rounded-r-lg"
        >
          <Card.Content className="flex items-center">
            <FiInfo className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0" />
            <div className="text-lg text-blue-900">
              <p className="font-semibold">Under Development</p>
              <p>
                We're continuously improving MediScan. Check back often for new
                features and updates.
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Optional: Add some bottom padding */}
        <div className="h-16"></div>
      </div>
      <FeedbackButton isFloating={true} />
    </div>
  );
};

export default withErrorBoundary(Updates, {
  errorKey: "updates-page",
});

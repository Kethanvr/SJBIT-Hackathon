import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiSearch, FiFilter, FiExternalLink } from "react-icons/fi";
import { toast } from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader";
import { useProTheme } from "../../utils/useProTheme";

// Dummy data for insurance providers with real images
const insuranceProviders = [
  {
    id: 1,
    name: "Blue Cross Blue Shield",
    logo: "https://1finance.co.in/magazine/wp-content/uploads/2023/06/16404392_tp212-socialmedia-02-1-scaled.jpg",
    plans: ["Basic", "Standard", "Premium"],
    coverage: ["Hospitalization", "Outpatient", "Prescription"],
    rating: 4.5,
    reviews: 1200,
    isLocal: false,
  },
  {
    id: 2,
    name: "Healthcare",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/UnitedHealthcare_logo.svg/1200px-UnitedHealthcare_logo.svg.png",
    plans: ["Essential", "Plus", "Elite"],
    coverage: ["Hospitalization", "Outpatient", "Dental", "Vision"],
    rating: 4.3,
    reviews: 980,
    isLocal: false,
  },
  {
    id: 3,
    name: "Aetna",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Aetna_logo.svg/1200px-Aetna_logo.svg.png",
    plans: ["Basic", "Enhanced", "Comprehensive"],
    coverage: ["Hospitalization", "Outpatient", "Mental Health"],
    rating: 4.2,
    reviews: 850,
    isLocal: false,
  },
  {
    id: 4,
    name: "Cigna",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cigna_logo.svg/1200px-Cigna_logo.svg.png",
    plans: ["Standard", "Premium", "Platinum"],
    coverage: ["Hospitalization", "Outpatient", "International"],
    rating: 4.4,
    reviews: 1100,
    isLocal: false,
  },
  {
    id: 5,
    name: "Kaiser Permanente",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kaiser_Permanente_logo.svg/1200px-Kaiser_Permanente_logo.svg.png",
    plans: ["Basic", "Plus", "Premium"],
    coverage: ["Hospitalization", "Outpatient", "Preventive"],
    rating: 4.6,
    reviews: 1500,
    isLocal: false,
  },
  {
    id: 6,
    name: "Humana",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Humana_logo.svg/1200px-Humana_logo.svg.png",
    plans: ["Essential", "Standard", "Premium"],
    coverage: ["Hospitalization", "Outpatient", "Prescription"],
    rating: 4.1,
    reviews: 920,
    isLocal: false,
  },
  {
    id: 7,
    name: "Anthem",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Anthem_logo.svg/1200px-Anthem_logo.svg.png",
    plans: ["Basic", "Enhanced", "Premium"],
    coverage: ["Hospitalization", "Outpatient", "Dental"],
    rating: 4.3,
    reviews: 1050,
    isLocal: false,
  },
  {
    id: 8,
    name: "Molina Healthcare",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Molina_Healthcare_logo.svg/1200px-Molina_Healthcare_logo.svg.png",
    plans: ["Standard", "Plus", "Premium"],
    coverage: ["Hospitalization", "Outpatient", "Vision"],
    rating: 4.0,
    reviews: 780,
    isLocal: false,
  },
  {
    id: 9,
    name: "Centene",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Centene_logo.svg/1200px-Centene_logo.svg.png",
    plans: ["Basic", "Standard", "Premium"],
    coverage: ["Hospitalization", "Outpatient", "Prescription"],
    rating: 4.2,
    reviews: 890,
    isLocal: false,
  },
  {
    id: 10,
    name: "Health Net",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Health_Net_logo.svg/1200px-Health_Net_logo.svg.png",
    plans: ["Essential", "Plus", "Premium"],
    coverage: ["Hospitalization", "Outpatient", "Dental", "Vision"],
    rating: 4.1,
    reviews: 820,
    isLocal: false,
  },
  // Local providers
  {
    id: 11,
    name: "Local Health Insurance Co.",
    logo: "https://via.placeholder.com/60?text=Local",
    plans: ["Basic", "Standard"],
    coverage: ["Hospitalization", "Outpatient"],
    rating: 4.0,
    reviews: 450,
    isLocal: true,
  },
  {
    id: 12,
    name: "Community Health Plan",
    logo: "https://via.placeholder.com/60?text=Local",
    plans: ["Basic", "Plus"],
    coverage: ["Hospitalization", "Outpatient", "Dental"],
    rating: 4.2,
    reviews: 380,
    isLocal: true,
  },
];

const InsuranceProviders = () => {
  const { t } = useTranslation("healthInsurance");
  const navigate = useNavigate();
  const { isPro } = useProTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showLocalOnly, setShowLocalOnly] = useState(false);

  const handleEnquire = (providerName) => {
    toast.success(
      `Your enquiry for ${providerName} has been sent successfully! We'll contact you soon.`,
      {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          borderRadius: "10px",
          padding: "16px",
        },
      }
    );
  };

  const filteredProviders = insuranceProviders.filter((provider) => {
    const matchesSearch = provider.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || provider.plans.includes(selectedFilter);
    const matchesLocal = !showLocalOnly || provider.isLocal;
    return matchesSearch && matchesFilter && matchesLocal;
  });
  return (
    <div className="container-narrow pb-4 px-4 md:px-0 mx-auto h-screen overflow-y-auto">
      <PageHeader
        title={t("title", "Insurance Providers")}
        onBack={() => navigate(-1)}
      />

      {/* Center Filter and Search Section */}
      <div className="mt-4 max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t(
              "searchPlaceholder",
              "Search insurance providers..."
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border text-lg ${
              isPro
                ? "bg-yellow-50 border-yellow-200 focus:border-yellow-400"
                : "bg-white border-gray-200 focus:border-blue-400"
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isPro ? "focus:ring-yellow-400" : "focus:ring-blue-400"
            } shadow-sm`}
          />
          <FiSearch
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-xl ${
              isPro ? "text-yellow-600" : "text-gray-400"
            }`}
          />        </div>

        {/* Filter Tabs - Centered and Beautiful */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200/50">
          {/* Plan Type Filters - Responsive for mobile, Local next to All */}
          <div className="flex flex-nowrap overflow-x-auto gap-1 mb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:justify-center">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`min-w-[100px] px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedFilter === "all"
                  ? isPro
                    ? "bg-yellow-500 text-yellow-900 shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : isPro
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t("filters.all", "All Plans")}
            </button>
            <button
              onClick={() => setShowLocalOnly(!showLocalOnly)}
              className={`min-w-[100px] inline-flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                showLocalOnly
                  ? isPro
                    ? "bg-yellow-500 text-yellow-900 shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : isPro
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="relative flex h-3 w-3 mr-2">
                {showLocalOnly && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPro ? "bg-yellow-400" : "bg-blue-400"} opacity-75`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${showLocalOnly ? (isPro ? "bg-yellow-500" : "bg-blue-500") : "bg-gray-400"}`}></span>
              </span>
              {t("filters.local", "Local ")}
            </button>
            <button
              onClick={() => setSelectedFilter("Basic")}
              className={`min-w-[100px] px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedFilter === "Basic"
                  ? isPro
                    ? "bg-yellow-500 text-yellow-900 shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : isPro
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t("filters.basic", "Basic")}
            </button>
            <button
              onClick={() => setSelectedFilter("Standard")}
              className={`min-w-[100px] px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedFilter === "Standard"
                  ? isPro
                    ? "bg-yellow-500 text-yellow-900 shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : isPro
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t("filters.standard", "Standard")}
            </button>
            <button
              onClick={() => setSelectedFilter("Premium")}
              className={`min-w-[100px] px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedFilter === "Premium"
                  ? isPro
                    ? "bg-yellow-500 text-yellow-900 shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : isPro
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t("filters.premium", "Premium")}
            </button>
          </div>
        </div>
      </div>      {/* Providers List */}
      <div className="mt-8 space-y-4 max-w-4xl mx-auto">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className={`p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
              isPro
                ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-start space-x-4">
              <img
                src={provider.logo}
                alt={provider.name}
                className="w-20 h-20 rounded-lg object-contain bg-white p-2"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isPro ? "text-yellow-900" : "text-gray-900"
                      }`}
                    >
                      {provider.name}
                      {provider.isLocal && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Local
                        </span>
                      )}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <div
                        className={`flex items-center ${
                          isPro ? "text-yellow-600" : "text-blue-600"
                        }`}
                      >
                        <span className="font-medium">{provider.rating}</span>
                        <span className="mx-1">•</span>
                        <span className="text-sm">
                          {provider.reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEnquire(provider.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isPro
                        ? "bg-yellow-500 text-yellow-900 hover:bg-yellow-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } transition-colors duration-200`}
                  >
                    {t("enquire", "Enquire")}
                  </button>
                </div>
                <div className="mt-2">
                  <h4
                    className={`text-sm font-medium ${
                      isPro ? "text-yellow-800" : "text-gray-700"
                    }`}
                  >
                    {t("availablePlans", "Available Plans")}:
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {provider.plans.map((plan) => (
                      <span
                        key={plan}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isPro
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {plan}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <h4
                    className={`text-sm font-medium ${
                      isPro ? "text-yellow-800" : "text-gray-700"
                    }`}
                  >
                    {t("coverage", "Coverage")}:
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {provider.coverage.map((item) => (
                      <span
                        key={item}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isPro
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsuranceProviders;

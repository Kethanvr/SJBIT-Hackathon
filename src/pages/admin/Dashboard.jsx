import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiPieChart, FiBarChart2, FiSettings, FiGrid } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import TutorialAnalyticsPanel from '../../components/admin/TutorialAnalyticsPanel';
import { withErrorBoundary } from '../../components/ui/ErrorBoundary';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminCheckLoading } = useIsAdmin(user?.id);
  const [activeTab, setActiveTab] = useState('tutorial');

  // If not an admin, redirect to home
  if (!adminCheckLoading && !isAdmin) {
    navigate(ROUTES.HOME);
    return null;
  }

  // Tabs for different analytics sections
  const tabs = [
    { id: 'tutorial', label: 'Tutorial Analytics', icon: <FiUsers />, color: 'blue' },
    { id: 'usage', label: 'App Usage', icon: <FiBarChart2 />, color: 'green' },
    { id: 'features', label: 'Feature Adoption', icon: <FiPieChart />, color: 'purple' },
    { id: 'settings', label: 'Admin Settings', icon: <FiSettings />, color: 'gray' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {adminCheckLoading ? (
          // Loading state
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Admin welcome section */}
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-2">Welcome to the Admin Dashboard</h2>
              <p className="opacity-90">
                Monitor user engagement, analyze app usage patterns, and optimize the user experience.
              </p>
            </motion.div>

            {/* Dashboard tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="flex border-b overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600`
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`mr-2 ${activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400'}`}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard content based on active tab */}
            <div className="mb-10">
              {activeTab === 'tutorial' && <TutorialAnalyticsPanel />}
              
              {activeTab === 'usage' && (
                <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FiGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">App Usage Analytics</h3>
                    <p className="text-gray-400 mt-2">This feature is coming soon.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FiGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Feature Adoption Analytics</h3>
                    <p className="text-gray-400 mt-2">This feature is coming soon.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FiGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Admin Settings</h3>
                    <p className="text-gray-400 mt-2">This feature is coming soon.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default withErrorBoundary(AdminDashboard, {
  errorKey: 'admin-dashboard'
});

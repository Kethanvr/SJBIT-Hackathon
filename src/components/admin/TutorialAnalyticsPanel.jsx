import React, { useState, useEffect } from 'react';
import { FiUsers, FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

const TutorialAnalyticsPanel = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('week');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Get the date range based on the selected timeframe
      const now = new Date();
      let startDate = new Date();
      
      switch(timeframe) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      // Format dates for the query
      const startDateStr = startDate.toISOString();
      const endDateStr = now.toISOString();

      // Run SQL query to get analytics data
      const { data, error } = await supabase.rpc('get_tutorial_analytics', {
        start_date: startDateStr,
        end_date: endDateStr
      });

      if (error) throw error;

      // Get recent events for the activity feed
      const { data: recentEvents, error: recentError } = await supabase
        .from('user_analytics')
        .select('*')
        .in('event_type', ['tutorial_view', 'tutorial_complete', 'tutorial_skipped', 'onboarding_complete'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      setAnalyticsData({
        summary: data || [],
        recent: recentEvents || []
      });
    } catch (err) {
      console.error('Error fetching tutorial analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  // If the data isn't loaded yet, show a loading indicator
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tutorial Analytics</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // If there was an error, show an error message
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tutorial Analytics</h2>
        </div>
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <p>Error loading analytics: {error}</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If there's no data, show a message
  if (!analyticsData || (!analyticsData.summary.length && !analyticsData.recent.length)) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tutorial Analytics</h2>
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeframe === period 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center p-8">
            <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No analytics data available</h3>
            <p className="text-gray-500 mt-2">Tutorial events will appear here once users start interacting with the app.</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to summarize data for the overview cards
  const getOverviewStats = () => {
    const summary = analyticsData.summary;
    const totalViews = summary.find(item => item.event_type === 'tutorial_view')?.count || 0;
    const completions = summary.find(item => item.event_type === 'tutorial_complete')?.count || 0;
    const skips = summary.find(item => item.event_type === 'tutorial_skipped')?.count || 0;
    
    // Calculate completion rate
    const completionRate = totalViews > 0 
      ? Math.round((completions / (completions + skips)) * 100) 
      : 0;
    
    return [
      {
        title: 'Tutorial Views',
        value: totalViews,
        icon: <FiUsers className="text-blue-500" />,
        change: '+12%', // In a real app, you would calculate this
        changeType: 'positive'
      },
      {
        title: 'Completion Rate',
        value: `${completionRate}%`,
        icon: <FiPieChart className="text-green-500" />,
        change: completionRate > 50 ? 'Good' : 'Needs Improvement',
        changeType: completionRate > 50 ? 'positive' : 'negative'
      },
      {
        title: 'Skipped Tutorial',
        value: skips,
        icon: <FiTrendingUp className="text-yellow-500" />,
        change: skips > completions ? 'High' : 'Low',
        changeType: skips > completions ? 'negative' : 'positive'
      }
    ];
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tutorial Analytics</h2>
        <div className="flex space-x-2">
          {['day', 'week', 'month', 'year'].map(period => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === period 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {getOverviewStats().map((stat, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 bg-white rounded-full">
                {stat.icon}
              </div>
            </div>
            <div className={`mt-2 text-sm ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-4 flex items-center">
          <FiCalendar className="mr-2" /> Recent Tutorial Activity
        </h3>
        <div className="bg-gray-50 rounded-lg border border-gray-100">
          {analyticsData.recent.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {analyticsData.recent.map((event, index) => (
                <div key={index} className="p-3 flex items-start hover:bg-gray-100">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                    event.event_type === 'tutorial_complete' ? 'bg-green-500' :
                    event.event_type === 'tutorial_skipped' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">
                        {event.event_type === 'tutorial_view' ? 'Tutorial Viewed' :
                         event.event_type === 'tutorial_complete' ? 'Tutorial Completed' :
                         event.event_type === 'tutorial_skipped' ? 'Tutorial Skipped' :
                         event.event_type === 'onboarding_complete' ? 'Onboarding Completed' :
                         event.event_type}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No recent activity to display
            </div>
          )}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-blue-700 font-medium mb-2">Insights & Recommendations</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          {analyticsData.summary.length > 0 && (
            <>
              <li>• {analyticsData.summary.find(item => item.event_type === 'tutorial_skipped')?.count > 
                     analyticsData.summary.find(item => item.event_type === 'tutorial_complete')?.count 
                ? "Consider making the tutorial shorter or more engaging as many users are skipping it."
                : "Your tutorial completion rate is good! Users are finding value in the guidance."}
              </li>
              <li>• Consider adding more interactive elements to improve engagement with the tutorial.</li>
              <li>• Analyze which parts of the tutorial receive the most attention to optimize the flow.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TutorialAnalyticsPanel;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Constants
const UPDATES_SEEN_KEY = 'updatesSeenInSession';

export function useHomePageLogic() {
  const [session, setSession] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showUpdatesOverlay, setShowUpdatesOverlay] = useState(false);
  
  // Initialize showWelcome based on sessionStorage
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if the welcome screen has been seen in this session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    // Default to true only if it hasn't been seen
    return !hasSeenWelcome; 
  });
  
  const navigate = useNavigate();

  // Check session and welcome status on mount
  useEffect(() => {
    const checkSessionAndWelcome = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');

      // If there's no session OR if the welcome screen has already been seen,
      // ensure showWelcome is false.
      if (!session || hasSeenWelcome === 'true') {
        setShowWelcome(false);
      } 
      // If there IS a session AND the welcome screen hasn't been seen,
      // ensure showWelcome is true
      else if (session && hasSeenWelcome !== 'true') {
        setShowWelcome(true);
      }
    };

    checkSessionAndWelcome();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Check if updates overlay should be shown
    const hasSeenUpdates = sessionStorage.getItem(UPDATES_SEEN_KEY);
    if (!hasSeenUpdates) {
      setShowUpdatesOverlay(true);
    }
  }, []);

  // Handler for welcome screen completion
  const handleWelcomeComplete = () => {
    // Mark welcome screen as seen for this session
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  // Handler for closing updates overlay
  const handleCloseUpdatesOverlay = () => {
    setShowUpdatesOverlay(false);
    // The overlay component itself sets the sessionStorage item on close
  };

  // Handler for starting a new chat
  const handleNewChat = () => {
    // Clear localStorage
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("currentChatMessages");
    localStorage.removeItem("currentChatTitle");

    // Navigate to chat
    navigate("/chat");
  };

  // Coin state and fetch logic
  const [coins, setCoins] = useState(0);

  // Fetch coin balance when session changes or sidebar opens
  useEffect(() => {
    const fetchCoins = async () => {
      if (!session?.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", session.user.id)
        .single();
      setCoins(profile?.coins ?? 0);
    };
    if (session?.user) fetchCoins();
  }, [session, isSidebarOpen]);

  // Add Coin handler (placeholder)
  const handleAddCoin = () => {
    alert('Coin top-up coming soon!');
  };

  return {
    session,
    isSidebarOpen,
    setIsSidebarOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    showUpdatesOverlay,
    showWelcome,
    handleWelcomeComplete,
    handleCloseUpdatesOverlay,
    handleNewChat,
    coins,
    handleAddCoin
  };
}

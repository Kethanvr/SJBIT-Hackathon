import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Custom hook to handle account page logic
 */
export const useAccountLogic = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    fetchChatHistory();
  }, []);

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: chats, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChatHistory(chats || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all your data? This action cannot be undone."
      )
    )
      return;

    try {
      setLoading(true);
      // Delete all scans
      await supabase.from("scans").delete().eq("user_id", user.id);
      // Delete all chats
      await supabase.from("chats").delete().eq("user_id", user.id);
      alert("All data has been deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data");
    } finally {
      setLoading(false);
    }
  };
  const refreshProfile = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      
      if (currentUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  return {
    loading,
    user,
    profile,
    chatHistory,
    handleLogout,
    handleDeleteAllData,
    refreshProfile
  };
};

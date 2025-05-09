import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

/**
 * Custom hook to check if the current user is an admin
 * @param {string} userId - The current user's ID
 * @returns {Object} - Object containing isAdmin status and loading state
 */
export const useIsAdmin = (userId) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        
        if (!userId) {
          setIsAdmin(false);
          return;
        }
        
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();
          
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(data?.role === "admin");
      } catch (err) {
        console.error("Unexpected error in useIsAdmin:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [userId]);
  
  return { isAdmin, loading };
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { handleProfileImageUpload } from "../utils/profileUtils";

export function usePersonalInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    recovery_email: "",
    phone: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        recovery_email: profile.recovery_email || "",
        phone: profile.phone || "",
        dob: profile.dob || "",
        gender: profile.gender || "",
      });
    }
  }, [profile]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        if (error.code === "PGRST116") {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([              {
                id: user.id,                username: user.email?.split("@")[0] || "",
                full_name: user.user_metadata?.full_name || "",
                avatar_url: user.user_metadata?.avatar_url || "",
                coins: 5, // Start with 5 coins
                first_login: true, // Set first_login flag for new users
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();
          if (insertError) throw insertError;
          setProfile(newProfile);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      setError("Error loading user data!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    if (!profile) return;
    try {
      setUploading(true);
      const url = await handleProfileImageUpload({
        event,
        profileId: profile.id,
        setUploading,
        setProfile,
        profile,
      });
      if (url) {
        await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
        setProfile((prev) => ({ ...prev, avatar_url: url }));
        alert("Profile picture updated successfully!");
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    try {
      setUploading(true);
      await supabase.from("profiles").update({ avatar_url: null }).eq("id", profile.id);
      setProfile((prev) => ({ ...prev, avatar_url: null }));
      alert("Profile picture removed successfully!");
    } catch (error) {
      alert("Error removing profile picture!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const updates = {
        ...formData,
        dob: formData.dob || null,
        updated_at: new Date().toISOString(),
      };
      for (const key of Object.keys(updates)) {
        if (updates[key] === "" || updates[key] == null) {
          delete updates[key];
        }
      }
      await supabase.from("profiles").update(updates).eq("id", profile.id);
      alert("Profile updated successfully!");
      setIsEditing(false);
      await getProfile();
    } catch (error) {
      setError(error.message || "Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return {
    user,
    profile,
    loading,
    uploading,
    error,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleChange,
  };
}

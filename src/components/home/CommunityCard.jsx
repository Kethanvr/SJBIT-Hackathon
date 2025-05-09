import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; 
import Card from "../ui/Card";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabase"; // Fixed import path
import { useAuth } from "../../hooks/useAuth";
import { CloudinaryUploadWidget } from "../ui/CloudinaryUploadWidget";

// Rest of the component code...

const CommunityCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleViewCommunity = () => {
    navigate("/community");
  };

  const handleCreatePost = () => {
    navigate("/community/create");
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("community.title", "Community")}
          </h2>
          <Button
            variant="outline"
            onClick={handleViewCommunity}
            className="text-sm"
          >
            {t("community.viewAll", "View All")}
          </Button>
        </div>

        <p className="text-gray-600">
          {t(
            "community.description",
            "Share your health journey, tips, and experiences with our community."
          )}
        </p>

        <div className="flex space-x-4">
          <Button onClick={handleCreatePost} className="flex-1">
            {t("community.createPost", "Create Post")}
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {t(
            "community.stats",
            "Join {{count}} members sharing their health experiences",
            {
              count: "1.2k",
            }
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommunityCard;

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CloudinaryUploadWidget } from "../../components/ui/CloudinaryUploadWidget";

const CreatePost = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (result) => {
    if (result.event === "success") {
      setImageUrl(result.info.secure_url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError(t("Please fill in all required fields"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from("community_posts")
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            description: description.trim(),
            image_url: imageUrl,
            is_private: isPrivate,
            likes_count: 0,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      navigate("/community");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(t("Failed to create post. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <Card.Header>
          <Card.Title>{t("Create New Post")}</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Title")} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t("Enter post title")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Description")} *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                placeholder={t("Write your post content")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Image")}
              </label>
              <CloudinaryUploadWidget
                onUpload={handleImageUpload}
                folder="community_posts"
              />
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="max-h-48 rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPrivate"
                className="ml-2 block text-sm text-gray-700"
              >
                {t("Post as Anonymous")}
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/community")}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit" isLoading={loading}>
                {t("Create Post")}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreatePost;

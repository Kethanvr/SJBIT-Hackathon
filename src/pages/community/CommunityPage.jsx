import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const CommunityPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("community_posts")
        .select(
          `
          *,
          profiles:user_id (
            full_name,
            avatar_url
          ),
          post_likes (
            user_id
          ),
          post_comments (
            id,
            content,
            created_at,
            is_private,
            profiles:user_id (
              full_name,
              avatar_url
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(t("Failed to load posts"));
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { error: likeError } = await supabase.from("post_likes").insert([
        {
          post_id: postId,
          user_id: user.id,
        },
      ]);

      if (likeError) throw likeError;

      // Update the post's likes count
      const { error: updateError } = await supabase.rpc("increment_likes", {
        post_id: postId,
      });

      if (updateError) throw updateError;

      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId, content, isPrivate = false) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { error: commentError } = await supabase
        .from("post_comments")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content,
            is_private: isPrivate,
          },
        ]);

      if (commentError) throw commentError;

      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t("Loading posts...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("Community")}</h1>
        <Button onClick={() => navigate("/community/create")}>
          {t("Create Post")}
        </Button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            )}
            <Card.Content>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>
                  {post.is_private
                    ? t("Anonymous")
                    : post.profiles?.full_name || t("Unknown User")}
                </span>
                <span className="mx-2">•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                >
                  <span>❤️</span>
                  <span>{post.likes_count}</span>
                </button>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  {post.post_comments?.length || 0} {t("comments")}
                </span>
              </div>

              {/* Comments Section */}
              <div className="mt-4 space-y-4">
                {post.post_comments?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <span>
                        {comment.is_private
                          ? t("Anonymous")
                          : comment.profiles?.full_name || t("Unknown User")}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}

                {/* Add Comment Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const content = e.target.comment.value;
                    const isPrivate = e.target.isPrivate.checked;
                    if (content.trim()) {
                      handleComment(post.id, content.trim(), isPrivate);
                      e.target.reset();
                    }
                  }}
                  className="mt-4"
                >
                  <textarea
                    name="comment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("Write a comment...")}
                    rows="2"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="isPrivate"
                      id={`private-${post.id}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`private-${post.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {t("Comment as Anonymous")}
                    </label>
                    <Button type="submit" variant="primary" className="ml-auto">
                      {t("Comment")}
                    </Button>
                  </div>
                </form>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;

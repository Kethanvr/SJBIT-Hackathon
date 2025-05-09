import React, { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { createNotification } from "../../lib/supabase/notifications";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { fetchWithFallback } from "../../utils/apiUtils";

// Helper to check if user is admin (assumes 'role' column in 'profiles' table)
const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  React.useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setIsAdmin(false);
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (error || !data) return setIsAdmin(false);
      setIsAdmin(data.role === "admin");
    };
    checkAdmin();
  }, [user]);
  return isAdmin;
};

const SendNotification = () => {
  const isAdmin = useIsAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  if (!user) return <div className="p-8">Please log in.</div>;
  if (!isAdmin) return <div className="p-8 text-red-600">Access denied. Admins only.</div>;

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);    try {
      // 1. Fetch only regular user IDs (exclude admins)
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "user");
      if (error) throw error;
      
      // 2. Send notification to each user in Supabase database
      let successCount = 0;
      for (const u of users) {
        const res = await createNotification(
          u.id,
          title,
          message,
          "admin_broadcast",
          url || null
        );
        if (res) successCount++;
      }
        // 3. Send push notification via OneSignal to all users
      try {
        // Get user IDs from the database for sending targeted notifications
        const userIds = users.map(u => u.id);
        
        const pushResult = await fetchWithFallback(
          '/api/notifications/send',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              message,
              userIds, // Send to specific users by ID to better match database records
              // Include data payload to link push notifications with database entries
              data: {
                type: "admin_broadcast",
                related_url: url || null,
                notification_source: "admin_panel"
              }
            }),
          }
        );
        setResult(`Notification sent to ${successCount} users in database and push notification sent to all subscribed devices.`);
      } catch (pushError) {
        console.error("Push notification error:", pushError);
        setResult(`Notification sent to ${successCount} users in database, but push notification failed: ${pushError.message}`);
      }
      
      setTitle(""); 
      setMessage(""); 
      setUrl("");
    } catch (err) {
      setResult("Error sending notifications: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Send Notification to All Users</h1>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Related URL (optional)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send to All Users"}
        </button>
      </form>
      {result && <div className="mt-4 text-green-700 font-medium">{result}</div>}
      <button
        className="mt-8 text-blue-600 underline"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default SendNotification;

import { useState, useEffect, useRef } from "react";
import { getScanHistory, getChatHistory, deleteScan, deleteChat, supabase } from "../lib/supabase";

export function useHistoryLogic(navigate, t) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");  const [user, setUser] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }
        setUser(user);
        await fetchHistory(user.id);
        setupRealtimeSubscriptions(user.id);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndHistory();
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
    // eslint-disable-next-line
  }, [navigate]);

  const setupRealtimeSubscriptions = (userId) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    subscriptionRef.current = supabase
      .channel('public:chats-history')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats', filter: `user_id=eq.${userId}` }, () => fetchHistory(userId))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scans', filter: `user_id=eq.${userId}` }, () => fetchHistory(userId))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `user_id=eq.${userId}` }, () => fetchHistory(userId))
      .subscribe();
  };

  const fetchHistory = async (userId) => {
    try {
      setProcessingAction(true);
      const [scansData, chatsData] = await Promise.all([
        getScanHistory(userId),
        getChatHistory(userId),
      ]);
      const combinedItems = [
        ...scansData.map((scan) => ({ ...scan, type: "scan" })),
        ...chatsData.map((chat) => ({ ...chat, type: "chat" })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setItems(combinedItems);
    } catch (error) {
      console.error("Error fetching history:", error.message);
    } finally {
      setProcessingAction(false);
    }
  };
  const handleDeleteItem = async (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setProcessingAction(true);
      if (itemToDelete.type === "scan") {
        await deleteScan(itemToDelete.id, user.id);
      } else {
        await deleteChat(itemToDelete.id, user.id);
      }
      setItems(items.filter((i) => i.id !== itemToDelete.id));
    } catch (error) {
      console.error("Error deleting item:", error.message);
      alert(t('delete.failMessage'));
    } finally {
      setProcessingAction(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  return {
    items,
    setItems,
    loading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    user,
    processingAction,
    handleDeleteItem,
    showDeleteModal,
    itemToDelete,
    confirmDelete,
    cancelDelete
  };
}

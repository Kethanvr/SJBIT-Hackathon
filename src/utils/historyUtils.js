// Utility functions for History page
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getChatPreview = (messages, t) => {
  if (!messages || messages.length === 0) return t ? t('item.noMessages') : 'No messages';
  const lastMessage = messages[messages.length - 1];
  return lastMessage.content.length > 50
    ? `${lastMessage.content.substring(0, 50)}...`
    : lastMessage.content;
};

export const filterItems = (items, searchQuery, activeTab, getChatPreview, t) => {
  const searchTerms = searchQuery.toLowerCase().split(' ');
  return items.filter((item) => {
    const matchesSearch = searchTerms.every(term => 
      item.type === "scan"
        ? item.medicine_name?.toLowerCase().includes(term)
        : (
            item.title?.toLowerCase().includes(term) || 
            (item.messages && getChatPreview(item.messages, t).toLowerCase().includes(term))
          )
    );
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "scans") return item.type === "scan" && matchesSearch;
    if (activeTab === "chats") return item.type === "chat" && matchesSearch;
    return false;
  });
};

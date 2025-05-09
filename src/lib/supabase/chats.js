import { supabase } from './client';
import { uploadToCloudinary, generateUploadFolder } from '../../utils/cloudinaryUtils'; // Import Cloudinary utils

export const saveChat = async (userId, title, initialMessages = [], base64Image = null) => { // Add base64Image param
  try {
    if (!userId) throw new Error("User ID is required");
    if (!title) throw new Error("Chat title is required");

    // 1. Create the chat entry first
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .insert([{
        user_id: userId,
        title: title
      }])
      .select()
      .single();

    if (chatError) {
      console.error("Supabase insert chat error:", chatError);
      throw chatError;
    }

    // 2. If we have initial messages, save them individually using addMessage
    if (initialMessages.length > 0) {
      // Handle image upload for the *first* message if provided
      let firstMessageImageUrl = null;
      if (base64Image && initialMessages[0]?.role === 'user') {
        try {
          const folder = generateUploadFolder(userId);
          firstMessageImageUrl = await uploadToCloudinary(base64Image, `chat_images/${folder}`);
          console.log("Uploaded initial chat image:", firstMessageImageUrl);
        } catch (uploadError) {
          console.error("Error uploading initial chat image:", uploadError);
          // Proceed without image URL if upload fails
        }
      }

      for (const [index, msg] of initialMessages.entries()) {
        try {
          // Pass the imageUrl only for the first message if it was uploaded
          const imageUrlForMsg = (index === 0 && msg.role === 'user') ? firstMessageImageUrl : null;
          await addMessage(
            chatData.id,
            userId,
            msg.content,
            msg.role === 'user',
            imageUrlForMsg // Pass the URL here
          );
        } catch (messageError) {
          // Log the error but continue trying to save other messages if any
          console.error(`Error saving initial message for chat ${chatData.id}:`, messageError);
          // Optionally, decide if you want to roll back the chat creation here
        }
      }
    }

    return chatData;
  } catch (error) {
    console.error("Error in saveChat:", error.message);
    throw error;
  }
};

export const getChatHistory = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getChatHistory:", error.message);
    throw error;
  }
};

export const getChatById = async (chatId, userId = null) => {
  try {
    if (!chatId) throw new Error("Chat ID is required");

    // Try to get the chat by ID and check either ownership or shared status
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .or(`user_id.eq.${userId},is_shared.eq.true`)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Only fetch messages if we found a valid chat
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*, contributor_id")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    // Return combined data with messages
    return {
      ...data,
      messages: messagesData.map(msg => ({
        id: msg.id,
        role: msg.is_user ? 'user' : 'assistant',
        content: msg.content,
        created_at: msg.created_at,
        image_url: msg.image_url,
        contributor_id: msg.contributor_id
      }))
    };
  } catch (error) {
    console.error("Error in getChatById:", error.message);
    throw error;
  }
};

export const deleteChat = async (chatId, userId) => {
  try {
    if (!chatId) throw new Error("Chat ID is required");
    if (!userId) throw new Error("User ID is required");

    // Messages will be automatically deleted due to CASCADE delete in DB schema
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteChat:", error.message);
    throw error;
  }
};

export const updateChat = async (chatId, userId, updates) => {
  try {
    if (!chatId) throw new Error("Chat ID is required");
    if (!userId) throw new Error("User ID is required");
    if (!updates || typeof updates.title !== 'string') throw new Error("Updates object with a valid title string is required");

    // Only allow updating the title
    const validUpdates = {
      title: updates.title
    };

    const { data, error } = await supabase
      .from("chats")
      .update(validUpdates)
      .eq("id", chatId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update chat error:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in updateChat:", error.message);
    throw error;
  }
};

// Note: sendMessage needs fetchChatHistoryFromSupabase to be defined
export const sendMessage = async (message, userId) => {  const chatHistory = await getChatHistory(userId); // Using getChatHistory instead
  const response = await fetch("https://medi-scan-backend-new.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, userId, chatHistory }),
  });
  const data = await response.json();
  return data.content;
};

export const addChatMessage = async (chatId, userId, message) => {
  try {
    if (!chatId) throw new Error("Chat ID is required");
    if (!userId) throw new Error("User ID is required");
    if (!message || !message.content) throw new Error("Message content is required");

    const messageEntry = {
      chat_id: chatId,
      user_id: userId,
      is_user: message.role === 'user',
      content: message.content
    };

    const { data, error } = await supabase
      .from("messages")
      .insert([messageEntry])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in addChatMessage:", error.message);
    throw error;
  }
};

export const getChatMessages = async (chatId, userId) => {
  try {
    if (!chatId) throw new Error("Chat ID is required");
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    
    return data.map(msg => ({
      id: msg.id,
      role: msg.is_user ? 'user' : 'assistant',
      content: msg.content,
      created_at: msg.created_at
    }));
  } catch (error) {
    console.error("Error in getChatMessages:", error.message);
    throw error;
  }
};

// Modify addMessage to accept and save imageUrl
export const addMessage = async (chatId, userId, content, isUser = true, imageBase64 = null) => {
  try {    if (!chatId || !userId || (!content && !imageBase64)) {
      throw new Error("Missing required parameters");
    }

    // Verify session before insertion
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session verification error:", sessionError);
      throw new Error("Authentication error - please sign in again");
    }
    
    if (!sessionData.session) {
      console.error("No active session found");
      throw new Error("Authentication expired - please sign in again");
    }

    const messageData = {
      chat_id: chatId,
      content: content,
      is_user: isUser,
      contributor_id: userId, // Track who added this message
      user_id: sessionData.session.user.id // This is essential for RLS policies
    };

    if (imageBase64) {
      // Handle image storage logic here
      messageData.image_url = imageBase64;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert message error:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in addMessage:", error.message);
    throw error;
  }
};

export const makeShareable = async (chatId, userId) => {
  try {
    if (!chatId) throw new Error("Chat ID is required");
    if (!userId) throw new Error("User ID is required");

    // Only the owner can make a chat shareable
    const { data, error } = await supabase
      .from("chats")
      .update({ is_shared: true })
      .eq("id", chatId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error making chat shareable:", error.message);
    throw error;
  }
};
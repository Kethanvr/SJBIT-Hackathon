import React from "react";
import { formatText } from "../../utils/chatUtils";

export default function ChatMessageBubble({ msg, displayedText }) {
  return (
    <div className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div 
        className={`inline-block p-3 rounded-lg ${
          msg.role === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : msg.role === 'system'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-gray-200 text-gray-800 rounded-tl-none'
        }`}
      >
        {/* If it's an AI message with typing animation, format it with markdown */}
        {msg.role === 'ai' && msg.timestamp && displayedText[msg.timestamp] !== undefined ? (
          <span dangerouslySetInnerHTML={{ 
            __html: formatText(displayedText[msg.timestamp]) 
          }} />
        ) : (
          <span dangerouslySetInnerHTML={{ 
            __html: formatText(msg.content) 
          }} />
        )}
      </div>
    </div>
  );
}

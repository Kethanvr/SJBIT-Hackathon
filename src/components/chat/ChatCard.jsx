import { useProTheme } from '../../utils/useProTheme';
import { FiTrash2 } from "react-icons/fi";
import BottomNav from '../common/BottomNav';

export default function ChatCard({ chat, onContinue, onDelete, getChatPreview, formatDate }) {
  const { theme } = useProTheme();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate pr-2">
              {chat.title || "Untitled Chat"}
            </h3>
            <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
              {formatDate(chat.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {getChatPreview(chat.messages)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(chat.id)}
          className="ml-4 text-red-600 hover:text-red-700 flex-shrink-0"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onContinue(chat)}
        className={`mt-4 w-full ${theme.button} py-2 px-4 rounded-lg transition-colors`}
      >
        Continue Chat
      </button>
      <BottomNav />
    </div>
  );
}

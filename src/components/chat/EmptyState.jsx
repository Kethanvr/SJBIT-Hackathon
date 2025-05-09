import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function EmptyState() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiSearch className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-gray-900 font-medium">No chats found</h3>
      <p className="text-gray-500 mt-1">
        Start chatting with Doc to build your history
      </p>
      <Link
        to="/chat"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        New Chat
      </Link>
    </div>
  );
}

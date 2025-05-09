import React from "react";
import { FiArrowLeft, FiTrash2, FiShare2, FiMessageSquare } from "react-icons/fi";

export default function ScanDetailsHeader({ onBack, onAskAI, onShare, onDelete, deleting, t }) {
  return (
    <div className="bg-white px-4 py-4 flex items-center justify-between border-b sticky top-0 z-10">
      <button
        type="button"
        onClick={onBack}
        className="text-gray-600 p-2 -ml-2"
        aria-label={t('scanHistory:backButtonLabel')}
      >
        <FiArrowLeft className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onAskAI}
          className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
          aria-label={t('results:askAILabel')}
        >
          <FiMessageSquare className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onShare}
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
          aria-label={t('results:shareLabel')}
        >
          <FiShare2 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="text-red-600 hover:text-red-700 disabled:opacity-50 p-2 rounded-full hover:bg-red-50"
          aria-label={t('results:deleteLabel')}
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

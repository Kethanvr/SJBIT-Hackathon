import React from 'react';
import { FiMessageSquare, FiShare2, FiTrash2 } from 'react-icons/fi';

const ScanActionButtons = ({ t, onAskAI, onShare, onDelete, deleting }) => (
  <div className="flex items-center space-x-4">
    <button
      type="button"
      onClick={onAskAI}
      className="text-blue-600 hover:text-blue-700"
      aria-label={t('results:askAILabel')}
    >
      <FiMessageSquare className="w-6 h-6" />
    </button>
    <button
      type="button"
      onClick={onShare}
      className="text-gray-600 hover:text-gray-800"
      aria-label={t('results:shareLabel')}
    >
      <FiShare2 className="w-6 h-6" />
    </button>
    <button
      type="button"
      onClick={onDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-700 disabled:opacity-50"
      aria-label={t('results:deleteLabel')}
    >
      <FiTrash2 className="w-6 h-6" />
    </button>
  </div>
);

export default ScanActionButtons;

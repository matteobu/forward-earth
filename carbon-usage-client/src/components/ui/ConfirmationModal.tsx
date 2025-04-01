import React from 'react';

type ActionType = 'delete' | 'edit';

interface ConfirmationModalProps {
  isOpen: boolean;
  actionType: ActionType;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  actionType,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const titles = {
    delete: 'Confirm Deletion',
    edit: 'Confirm Edit',
  };

  const messages = {
    delete: 'Are you sure you want to delete this consumption?',
    edit: 'Are you sure you want to save changes to this consumption?',
  };

  const confirmButtons = {
    delete: {
      text: 'Delete',
      className: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    edit: {
      text: 'Save',
      className: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {titles[actionType]}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{messages[actionType]}</p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtons[actionType].className}`}
            onClick={onConfirm}
          >
            {confirmButtons[actionType].text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

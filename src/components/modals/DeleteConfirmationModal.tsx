import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../common/ui/Modal';

export interface DeleteConfirmationModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: T[];
  itemCount: number;
  entityName?: string; // e.g., "Device", "Site", "Rack"
  isLoading?: boolean;
  isDeleting?: boolean;
  renderItem?: (item: T, index: number) => React.ReactNode;
  warningMessage?: string;
  loadingMessage?: string;
}

function DeleteConfirmationModal<T = any>({
  isOpen,
  onClose,
  onConfirm,
  items,
  itemCount,
  entityName = 'Item',
  isLoading = false,
  isDeleting = false,
  renderItem,
  warningMessage,
  loadingMessage = 'Loading details...',
}: DeleteConfirmationModalProps<T>) {
  const defaultWarningMessage = `You are about to delete ${itemCount} ${entityName.toLowerCase()}(s). This will permanently remove the ${entityName.toLowerCase()}s and all associated data.`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm ${entityName} Deletion`}
      size="xl"
      closeOnBackdropClick={false}
    >
      <div className="space-y-4">
        {/* Warning Message */}
        <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold">
              Warning: This action cannot be undone!
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {warningMessage || defaultWarningMessage}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400">{loadingMessage}</span>
          </div>
        )}

        {/* Items List */}
        {!isLoading && items.length > 0 && renderItem && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              {entityName}s to be deleted ({items.length})
            </h4>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {items.map((item, index) => renderItem(item, index))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete {itemCount} {entityName}(s)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;


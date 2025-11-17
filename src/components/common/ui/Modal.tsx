import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  theme?: 'light' | 'dark';
  backdropClassName?: string;
  className?: string;
  closeOnBackdropClick?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  theme = 'dark',
  backdropClassName,
  className,
  closeOnBackdropClick = true,
  headerClassName,
  contentClassName,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const isDark = theme === 'dark';

  const backdropStyles = backdropClassName || 
    (isDark 
      ? 'fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity' 
      : 'fixed inset-0 bg-black/50 transition-opacity');

  const modalStyles = className || 
    `relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-xl shadow-2xl transition-all ${
      isDark 
        ? 'bg-gray-900/95 border border-gray-700' 
        : 'bg-white'
    }`;

  const headerStyles = headerClassName || 
    `flex items-center justify-between border-b px-6 py-4 ${
      isDark 
        ? 'border-gray-700' 
        : 'border-gray-200'
    }`;

  const titleStyles = isDark 
    ? 'text-lg font-semibold text-white' 
    : 'text-lg font-semibold text-gray-900';

  const closeButtonStyles = isDark
    ? 'text-gray-400 hover:text-gray-200 transition-colors'
    : 'text-gray-400 hover:text-gray-600 transition-colors';

  const contentStyles = contentClassName || 'px-6 py-4';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={backdropStyles}
        onClick={closeOnBackdropClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={modalStyles}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={headerStyles}>
              {title && (
                <h3 className={titleStyles}>
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={closeButtonStyles}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={contentStyles}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

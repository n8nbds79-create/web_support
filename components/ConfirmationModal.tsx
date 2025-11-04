
import React from 'react';
import Icon from './Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmButtonVariant = 'danger'
}) => {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    onConfirm();
    onClose();
  };

  const confirmClasses = confirmButtonVariant === 'danger' 
    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
  
  const iconContainerClasses = confirmButtonVariant === 'danger' 
    ? "bg-red-100" 
    : "bg-blue-100";
    
  const iconClasses = confirmButtonVariant === 'danger' 
    ? "text-red-600" 
    : "text-blue-600";
  
  const iconPath = "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.007H12v-.007z";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all" role="document">
        <div className="p-6">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconContainerClasses} sm:mx-0 sm:h-10 sm:w-10`}>
              <Icon path={iconPath} className={`h-6 w-6 ${iconClasses}`} />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-500">
                  {children}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmClasses}`}
            onClick={handleConfirmClick}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

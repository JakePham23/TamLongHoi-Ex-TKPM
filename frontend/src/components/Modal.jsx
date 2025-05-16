import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/components/Modal.scss';

const Modal = ({ 
  title, 
  children, 
  onClose, 
  size = 'md', 
  showCloseButton = true 
}) => {
  useTranslation();
  
  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal ${sizeClasses[size] || ''}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          {showCloseButton && (
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
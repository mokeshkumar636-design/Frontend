import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Delete', type = 'danger' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <button className="confirm-close-btn" onClick={onCancel} aria-label="Cancel">
          <X size={16} />
        </button>

        <div className={`confirm-icon-wrap confirm-icon-${type}`}>
          {type === 'danger' ? <Trash2 size={28} /> : <AlertTriangle size={28} />}
        </div>

        <div className="confirm-body">
          <h3 className="confirm-title">{title || 'Are you sure?'}</h3>
          <p className="confirm-message">
            {message || 'This action cannot be undone. Please confirm to proceed.'}
          </p>
        </div>

        <div className="confirm-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn btn-${type}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

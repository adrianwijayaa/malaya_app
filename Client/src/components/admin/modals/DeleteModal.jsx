import React from "react";
import "./DeleteModal.css";

const DeleteModal = ({ isOpen, request, onConfirm, onCancel }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="delete-overlay">
      <div className="delete-box">
        <h3>
          <i className="fas fa-exclamation-triangle"></i> Confirm Deletion
        </h3>
        <p>
          Are you sure you want to permanently delete this booking request? This
          action cannot be undone.
        </p>

        <div className="delete-details">
          <strong>{request.fullname}</strong>
          <span>{request.email}</span>
          <span>Status: {request.status}</span>
        </div>

        <div className="delete-actions">
          <button className="delete-cancel-btn" onClick={onCancel}>
            <i className="fas fa-times"></i> Cancel
          </button>
          <button className="delete-confirm-btn" onClick={onConfirm}>
            <i className="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

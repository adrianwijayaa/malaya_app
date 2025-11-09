import React from "react";
import "./LogoutModal.css";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-overlay">
      <div className="logout-box">
        <h3>
          <i className="fas fa-sign-out-alt"></i> Confirm Logout
        </h3>
        <p>Are you sure you want to log out from the admin panel?</p>

        <div className="logout-actions">
          <button className="logout-cancel-btn" onClick={onCancel}>
            <i className="fas fa-times"></i> Cancel
          </button>
          <button className="logout-confirm-btn" onClick={onConfirm}>
            <i className="fas fa-check"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

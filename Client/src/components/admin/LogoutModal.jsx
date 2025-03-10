import React from "react";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "2rem",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          animation: "modalSlideIn 0.3s ease",
          border: "1px solid rgba(53, 183, 179, 0.1)",
        }}
      >
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <i
            className="fas fa-sign-out-alt"
            style={{
              fontSize: "2rem",
              color: "#e53e3e",
              marginBottom: "1rem",
              display: "block",
            }}
          />
          <h3
            style={{
              fontSize: "1.5rem",
              color: "#2d3748",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            Confirm Logout
          </h3>
          <p
            style={{
              color: "#718096",
              fontSize: "1rem",
              lineHeight: 1.5,
            }}
          >
            Are you sure you want to logout from the admin dashboard?
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8f9fa",
              color: "#4a5568",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#edf2f7")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#e53e3e",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 6px rgba(229, 62, 62, 0.1)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#c53030";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#e53e3e";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LogoutModal;

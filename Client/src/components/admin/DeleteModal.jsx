import React from "react";
import ReactDOM from "react-dom";

const DeleteModal = ({ request, onConfirm, onCancel }) => {
  if (!request) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(5px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "16px",
          width: "450px",
          maxWidth: "90%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          animation: "slideIn 0.3s ease-out",
          transform: "translateY(0)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#FEE2E2",
              width: "60px",
              height: "60px",
              borderRadius: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <i
              className="fas fa-exclamation-triangle"
              style={{ color: "#DC2626", fontSize: "24px" }}
            />
          </div>
          <h3
            style={{
              color: "#1F2937",
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Delete Booking Request
          </h3>
          <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: "1.5" }}>
            Are you sure you want to delete this booking request? This action
            cannot be undone.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#F3F4F6",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#1F2937", fontSize: "16px" }}>
              {request.fullName}
            </strong>
          </div>
          <div style={{ color: "#6B7280", fontSize: "14px" }}>
            <div style={{ marginBottom: "4px" }}>{request.email}</div>
            <div>
              <span style={{ color: "#9CA3AF" }}>Booked on:</span>{" "}
              {request.date}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              backgroundColor: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#F3F4F6")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#DC2626",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#B91C1C")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#DC2626")
            }
          >
            <i className="fas fa-trash-alt" /> Delete
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>,
    document.body
  );
};

export default DeleteModal;

import React, { useState, useEffect } from "react";
import api from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "./OverviewTab.css";

const OverviewTab = ({ selectedRequest, onDataUpdate }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    preferedcontactmethod: "",
    status: "pending",
  });
  const [isSaving, setIsSaving] = useState(false);

  // 🟢 Load data ke form
  useEffect(() => {
    if (selectedRequest) {
      setFormData({
        fullname: selectedRequest.fullname || "",
        email: selectedRequest.email || "",
        phonenumber: selectedRequest.phonenumber || "",
        preferedcontactmethod:
          selectedRequest.PreferredContactMethod || // ✅ ambil langsung dari backend
          selectedRequest.preferedcontactmethod ||
          "",
        status: selectedRequest.status || "pending",
      });
    }
  }, [selectedRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSave = async () => {
    if (!selectedRequest?.id) return;
    setIsSaving(true);

    try {
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        phonenumber: formData.phonenumber,
        PreferredContactMethod: formData.preferedcontactmethod, // ✅ pakai key backend
        status: formData.status,
      };

      const res = await api.put(
        `/personal-info/${selectedRequest.id}`,
        payload
      );

      if (res.status === 200) {
        toast.success("✅ Personal info saved!", { toastId: "unique-toast" });
        if (onDataUpdate) await onDataUpdate(res.data.data); // ✅ auto refetch kaya status
      }
    } catch (err) {
      console.error("Failed to update personal info:", err);
      toast.error("❌ Failed to save personal information.", {
        toastId: "save-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overview-tab">
      <h3>
        <i className="fas fa-user"></i> Client Overview
      </h3>

      <div className="overview-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Full Name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <div className="form-group">
          <label>Preferred Contact Method</label>
          <select
            name="preferedcontactmethod"
            value={formData.preferedcontactmethod || ""}
            onChange={handleChange}
          >
            <option value="">Select Contact Method</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <button
        className="overview-save-btn"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Saving...
          </>
        ) : (
          <>
            <i className="fas fa-save"></i> Save Changes
          </>
        )}
      </button>
    </div>
  );
};

export default OverviewTab;

import React, { useEffect, useState } from "react";
import api from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "./AccommodationTab.css";

const AccommodationTab = ({ selectedRequest, onDataUpdate }) => {
  const [formData, setFormData] = useState({
    PreferredAccommodationType: "",
    RoomType: "",
    SpecialAccommodationRequests: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // 🔹 Fetch data ketika request berubah
  useEffect(() => {
    const fetchAccommodation = async () => {
      if (!selectedRequest?.id) return;
      try {
        const res = await api.get(
          `/accommodation-prefference/${selectedRequest.id}`
        );
        if (res.status === 200 && res.data?.data) {
          const a = res.data.data;
          setFormData({
            PreferredAccommodationType: a.PreferredAccommodationType || "",
            RoomType: a.RoomType || "",
            SpecialAccommodationRequests: a.SpecialAccommodationRequests || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch accommodation:", err);
      }
    };

    fetchAccommodation();
  }, [selectedRequest]);

  // 🔹 Handle input perubahan
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Simpan perubahan ke backend
  const handleSave = async () => {
    if (!selectedRequest?.id) return;
    setIsSaving(true);
    try {
      const res = await api.put(
        `/accommodation-prefference/${selectedRequest.id}`,
        formData
      );

      if (res.status === 200) {
        toast.success("✅ Accommodation details saved successfully!", {
          toastId: "save-success",
        });

        if (onDataUpdate) {
          await onDataUpdate(res.data.data);
        }
      }
    } catch (err) {
      console.error("Failed to save accommodation:", err);
      toast.error("❌ Failed to save accommodation details.", {
        toastId: "save-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="accommodation-tab">
      <h3>
        <i className="fas fa-hotel"></i> Accommodation Preferences
      </h3>

      <div className="accommodation-grid">
        <div className="accommodation-field">
          <label>Preferred Accommodation Type</label>
          <select
            name="PreferredAccommodationType"
            value={formData.PreferredAccommodationType}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            <option value="Luxury Resort">Luxury Resort</option>
            <option value="Boutique Hotel">Boutique Hotel</option>
            <option value="Private Villa">Private Villa</option>
            <option value="Budget Hotel">Budget Hotel</option>
            <option value="Guesthouse / Homestay">Guesthouse / Homestay</option>
          </select>
        </div>

        <div className="accommodation-field">
          <label>Room Type</label>
          <input
            type="text"
            name="RoomType"
            value={formData.RoomType}
            onChange={handleChange}
            placeholder="e.g., Deluxe Room, Suite, Twin Bed"
          />
        </div>

        <div className="accommodation-field">
          <label>Special Accommodation Requests</label>
          <textarea
            name="SpecialAccommodationRequests"
            rows="4"
            value={formData.SpecialAccommodationRequests}
            onChange={handleChange}
            placeholder="e.g., Sea view, breakfast included, etc."
          />
        </div>
      </div>

      <button
        className="accommodation-save-btn"
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

export default AccommodationTab;

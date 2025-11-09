import React, { useEffect, useState } from "react";
import api from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "./TravelDetailsTab.css";

const TravelDetailsTab = ({ selectedRequest, onDataUpdate }) => {
  const [travel, setTravel] = useState({
    destination: "",
    startDate: "",
    flexibleDates: "Yes",
    duration: 1,
    adults: 1,
    children: 0,
    childrenAges: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // 🟢 Fetch travel details
  useEffect(() => {
    const fetchTravelDetails = async () => {
      if (!selectedRequest?.id) return;
      try {
        const res = await api.get(`/travel-detail/${selectedRequest.id}`);
        if (res.status === 200 && res.data?.data) {
          const t = res.data.data;
          setTravel({
            id: t.id, // ✅ simpan travel detail ID
            destination: t.PreferredDestinations || "",
            startDate: t.PreferredStartDate
              ? t.PreferredStartDate.split("T")[0]
              : "",
            flexibleDates: t.FlexibleDates || "Yes",
            duration: t.TripDurationDays || 1,
            adults: t.Adults || 1,
            children: t.Children || 0,
            childrenAges: t.ChildrenAges || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch travel details:", err);
      }
    };

    fetchTravelDetails();
  }, [selectedRequest]);

  const handleChange = (field, value) => {
    setTravel((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedRequest?.id) return;
    setIsSaving(true);
    try {
      const res = await api.put(`/travel-detail/${travel.id}`, {
        PersonalID: travel.personalId, // atau boleh kosong kalau backend tak butuh
        PreferredDestinations: travel.destination || "",
        PreferredStartDate:
          travel.startDate || new Date().toISOString().split("T")[0],
        FlexibleDates: travel.flexibleDates || "Yes",
        TripDurationDays: travel.tripDurationDays
          ? Number(travel.tripDurationDays)
          : travel.endDate
          ? Math.ceil(
              (new Date(travel.endDate) - new Date(travel.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          : 1,
        Adults: travel.adults || 1,
        Children: travel.children || 0,
        ChildrenAges: travel.childrenAges || "N/A",
      });

      if (res.status === 200) {
        // ✅ Munculkan toast sebelum re-render
        toast.success("✅ Travel details saved successfully!", {
          toastId: "travel-save-success",
        });

        // 🔄 Setelah itu baru refresh data
        onDataUpdate && onDataUpdate(res.data.data);
      }
    } catch (err) {
      console.error("Failed to save travel details:", err);
      toast.error("❌ Failed to save travel details.", {
        toastId: "travel-save-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="travel-tab">
      <h3>
        <i className="fas fa-map-marked-alt"></i> Travel Details
      </h3>

      <div className="travel-grid">
        <div className="travel-field">
          <label>Preferred Destinations</label>
          <input
            type="text"
            value={travel.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            placeholder="e.g., Bali, Lombok, Yogyakarta"
          />
        </div>

        <div className="travel-field">
          <label>Preferred Start Date</label>
          <input
            type="date"
            value={travel.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>

        <div className="travel-field">
          <label>Flexible Dates</label>
          <select
            value={travel.flexibleDates}
            onChange={(e) => handleChange("flexibleDates", e.target.value)}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="travel-field">
          <label>Trip Duration (Days)</label>
          <input
            type="number"
            min="1"
            value={travel.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
          />
        </div>

        <div className="travel-field">
          <label>Adults</label>
          <input
            type="number"
            min="1"
            value={travel.adults}
            onChange={(e) => handleChange("adults", e.target.value)}
          />
        </div>

        <div className="travel-field">
          <label>Children</label>
          <input
            type="number"
            min="0"
            value={travel.children}
            onChange={(e) => handleChange("children", e.target.value)}
          />
        </div>

        <div className="travel-field">
          <label>Children Ages</label>
          <input
            type="text"
            value={travel.childrenAges}
            onChange={(e) => handleChange("childrenAges", e.target.value)}
            placeholder="e.g., 5, 8"
          />
        </div>
      </div>

      <button
        className="travel-save-btn"
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

export default TravelDetailsTab;

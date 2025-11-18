import React, { useState, useEffect, useRef } from "react";
import api from "../../../../api/axiosConfig";
import DeleteModal from "../../modals/DeleteModal";
import "./JoindetripTab.css";

const JoindetripTab = () => {
  // State management
  const [trips, setTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("active");
  const [jtripSelected, setJtripSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Refs for tracking original IDs
  const originalHighlightIdsRef = useRef([]);
  const originalIncludeIdsRef = useRef([]);
  const originalExcludeIdsRef = useRef([]);
  const originalPriceDetailIdsRef = useRef([]);

  // Form state
  const [jtripForm, setJtripForm] = useState({
    id: null,
    title: "",
    subtitle: "",
    heroImage: "",
    startDate: "",
    endDate: "",
    duration: "",
    location: "",
    groupSize: "",
    activityLevel: "",
    description: "",
    isActive: true,
    highlights: [],
    includes: [],
    excludes: [],
    priceDetails: [],
  });

  // Fetch trips on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // API Functions
  const fetchTrips = async () => {
    try {
      const res = await api.get("/join-trips");
      setTrips(res.data || []);
    } catch (error) {
      showToast("Failed to fetch trips", "error");
    }
  };

  // Toast notification
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJtripForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setJtripForm((prev) => ({ ...prev, heroImage: res.data.url }));
      showToast("Image uploaded successfully");
    } catch (error) {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleHighlightImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = [...jtripForm.highlights];
      updated[index].imageUrl = res.data.url;
      setJtripForm({ ...jtripForm, highlights: updated });
      showToast("Highlight image uploaded successfully");
    } catch (error) {
      showToast("Highlight image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let tripId = jtripForm.id;

      // Save main trip data
      if (tripId) {
        // Update existing trip
        const payload = { ...jtripForm };
        delete payload.highlights;
        delete payload.includes;
        delete payload.excludes;
        delete payload.priceDetails;
        await api.put(`/join-trip/${tripId}`, payload);
      } else {
        // Create new trip - only send main fields
        const payload = {
          title: jtripForm.title,
          subtitle: jtripForm.subtitle,
          heroImage: jtripForm.heroImage,
          startDate: jtripForm.startDate,
          endDate: jtripForm.endDate,
          duration: jtripForm.duration,
          location: jtripForm.location,
          groupSize: jtripForm.groupSize,
          activityLevel: jtripForm.activityLevel,
          description: jtripForm.description,
          isActive: jtripForm.isActive,
        };
        const res = await api.post("/join-trip", payload);
        tripId = res.data?.data?.id;
      }

      // Save highlights
      await saveHighlights(tripId);

      // Save includes
      await saveIncludes(tripId);

      // Save excludes
      await saveExcludes(tripId);

      // Save price details
      await savePriceDetails(tripId);

      showToast(
        jtripForm.id ? "Trip updated successfully" : "Trip created successfully"
      );
      fetchTrips();
      closeDrawer();
    } catch (error) {
      console.error("Save error:", error);
      showToast("Failed to save trip", "error");
    }
  };

  // Save sub-items functions
  const saveHighlights = async (tripId) => {
    const currentIds = [];

    for (const highlight of jtripForm.highlights) {
      const body = {
        JoinTripID: tripId,
        imageUrl: highlight.imageUrl,
        text: highlight.text,
        sortOrder: highlight.sortOrder ?? 0,
      };

      if (highlight.id) {
        await api.put(`/join-trip-highlight/${highlight.id}`, body);
        currentIds.push(highlight.id);
      } else if (highlight.imageUrl || highlight.text) {
        const response = await api.post("/join-trip-highlight", body);
        if (response.data?.data?.id) {
          currentIds.push(response.data.data.id);
        }
      }
    }

    if (jtripSelected?.id) {
      const toDelete = originalHighlightIdsRef.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/join-trip-highlight/${id}`))
      );
    }
  };

  const saveIncludes = async (tripId) => {
    const currentIds = [];

    for (const include of jtripForm.includes) {
      const body = {
        JoinTripID: tripId,
        title: include.title,
        sortOrder: include.sortOrder ?? 0,
      };

      if (include.id) {
        await api.put(`/join-trip-include/${include.id}`, body);
        currentIds.push(include.id);
      } else if (include.title) {
        const response = await api.post("/join-trip-include", body);
        if (response.data?.data?.id) {
          currentIds.push(response.data.data.id);
        }
      }
    }

    if (jtripSelected?.id) {
      const toDelete = originalIncludeIdsRef.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/join-trip-include/${id}`))
      );
    }
  };

  const saveExcludes = async (tripId) => {
    const currentIds = [];

    for (const exclude of jtripForm.excludes) {
      const body = {
        JoinTripID: tripId,
        label: exclude.label,
        sortOrder: exclude.sortOrder ?? 0,
      };

      if (exclude.id) {
        await api.put(`/join-trip-exclude/${exclude.id}`, body);
        currentIds.push(exclude.id);
      } else if (exclude.label) {
        const response = await api.post("/join-trip-exclude", body);
        if (response.data?.data?.id) {
          currentIds.push(response.data.data.id);
        }
      }
    }

    if (jtripSelected?.id) {
      const toDelete = originalExcludeIdsRef.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/join-trip-exclude/${id}`))
      );
    }
  };

  const savePriceDetails = async (tripId) => {
    const currentIds = [];

    for (const priceDetail of jtripForm.priceDetails) {
      const body = {
        JoinTripID: tripId,
        pax: priceDetail.pax,
        price: priceDetail.price,
        sortOrder: priceDetail.sortOrder ?? 0,
      };

      if (priceDetail.id) {
        await api.put(`/join-trip-price-detail/${priceDetail.id}`, body);
        currentIds.push(priceDetail.id);
      } else if (priceDetail.pax && priceDetail.price) {
        const response = await api.post("/join-trip-price-detail", body);
        if (response.data?.data?.id) {
          currentIds.push(response.data.data.id);
        }
      }
    }

    if (jtripSelected?.id) {
      const toDelete = originalPriceDetailIdsRef.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/join-trip-price-detail/${id}`))
      );
    }
  };

  // Drawer functions
  const openDrawer = async (trip = null) => {
    setDrawerOpen(true);

    if (trip) {
      try {
        const res = await api.get(`/join-trip/${trip.id}`);
        const data = res.data?.data;
        setJtripSelected(data);

        setJtripForm({
          id: data.id,
          title: data.title || "",
          subtitle: data.subtitle || "",
          heroImage: data.heroImage || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          duration: data.duration || "",
          location: data.location || "",
          groupSize: data.groupSize || "",
          activityLevel: data.activityLevel || "",
          description: data.description || "",
          isActive: !!data.isActive,
          highlights: (data.highlights || []).map((item) => ({
            id: item.id,
            text: item.text || "",
            imageUrl: item.imageUrl || "",
            sortOrder: item.sortOrder ?? 0,
          })),
          includes: (data.includes || []).map((item) => ({
            id: item.id,
            title: item.title || "",
            sortOrder: item.sortOrder ?? 0,
          })),
          excludes: (data.excludes || []).map((item) => ({
            id: item.id,
            label: item.label || "",
            sortOrder: item.sortOrder ?? 0,
          })),
          priceDetails: (data.priceDetails || []).map((item) => ({
            id: item.id,
            pax: item.pax || "",
            price: item.price || "",
            sortOrder: item.sortOrder ?? 0,
          })),
        });

        originalHighlightIdsRef.current = (data.highlights || []).map(
          (i) => i.id
        );
        originalIncludeIdsRef.current = (data.includes || []).map((i) => i.id);
        originalExcludeIdsRef.current = (data.excludes || []).map((i) => i.id);
        originalPriceDetailIdsRef.current = (data.priceDetails || []).map(
          (i) => i.id
        );
      } catch (error) {
        showToast("Failed to load trip details", "error");
      }
    } else {
      resetForm();
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setJtripSelected(null);
      resetForm();
    }, 300);
  };

  const resetForm = () => {
    setJtripForm({
      id: null,
      title: "",
      subtitle: "",
      heroImage: "",
      startDate: "",
      endDate: "",
      duration: "",
      location: "",
      groupSize: "",
      activityLevel: "",
      description: "",
      isActive: true,
      highlights: [],
      includes: [],
      excludes: [],
      priceDetails: [],
    });

    originalHighlightIdsRef.current = [];
    originalIncludeIdsRef.current = [];
    originalExcludeIdsRef.current = [];
    originalPriceDetailIdsRef.current = [];
  };

  // Delete handlers
  const confirmDelete = (trip) => {
    setTripToDelete({
      ...trip,
      fullname: trip.title,
      email: trip.location,
      status: trip.isActive ? "Active" : "Archived",
    });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/join-trip/${tripToDelete.id}`);
      showToast("Trip deleted successfully");
      fetchTrips();
    } catch (error) {
      showToast("Failed to delete trip", "error");
    } finally {
      setShowDeleteModal(false);
      setTripToDelete(null);
    }
  };

  // Add new item functions
  const addHighlight = () => {
    setJtripForm((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        { imageUrl: "", text: "", sortOrder: 0 },
      ],
    }));
  };

  const addInclude = () => {
    setJtripForm((prev) => ({
      ...prev,
      includes: [...prev.includes, { title: "", sortOrder: 0 }],
    }));
  };

  const addExclude = () => {
    setJtripForm((prev) => ({
      ...prev,
      excludes: [...prev.excludes, { label: "", sortOrder: 0 }],
    }));
  };

  const addPriceDetail = () => {
    setJtripForm((prev) => ({
      ...prev,
      priceDetails: [
        ...prev.priceDetails,
        { pax: "", price: "", sortOrder: 0 },
      ],
    }));
  };

  // Filter trips
  const filteredTrips = trips.filter((trip) =>
    activeFilter === "active" ? trip.isActive : !trip.isActive
  );

  return (
    <div className="jtrip-container">
      {/* Toast Notification */}
      {toast && <div className={`jtrip-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <header className="jtrip-header">
        <div className="jtrip-header-left">
          <h3>Join de Trip Management</h3>
          <div className="jtrip-tabs">
            <button
              className={activeFilter === "active" ? "active" : ""}
              onClick={() => setActiveFilter("active")}
            >
              Active
            </button>
            <button
              className={activeFilter === "archived" ? "active" : ""}
              onClick={() => setActiveFilter("archived")}
            >
              Archived
            </button>
          </div>
        </div>
        <button className="jtrip-btn-add" onClick={() => openDrawer()}>
          + Add New Trip
        </button>
      </header>

      {/* Table */}
      <div className="jtrip-table-wrapper">
        <table className="jtrip-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.title}</td>
                <td>{trip.location}</td>
                <td>{trip.duration}</td>
                <td>
                  <span
                    className={`jtrip-status-badge ${
                      trip.isActive ? "active" : "inactive"
                    }`}
                  >
                    {trip.isActive ? "Active" : "Archived"}
                  </span>
                </td>
                <td>
                  <button
                    className="jtrip-action-btn edit"
                    onClick={() => openDrawer(trip)}
                  >
                    Edit
                  </button>
                  <button
                    className="jtrip-action-btn delete"
                    onClick={() => confirmDelete(trip)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer Form */}
      <div className={`jtrip-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="jtrip-drawer-header">
          <h4>{jtripSelected ? "Edit Trip" : "Create New Trip"}</h4>
          <button onClick={closeDrawer}>×</button>
        </div>

        <form className="jtrip-form" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div>
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={jtripForm.title}
              onChange={handleChange}
              placeholder="Trip title"
              required
            />
          </div>

          <div>
            <label>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={jtripForm.subtitle}
              onChange={handleChange}
              placeholder="Trip subtitle"
            />
          </div>

          <div>
            <label>Hero Image * {uploading && "(Uploading...)"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {jtripForm.heroImage && (
              <img
                src={jtripForm.heroImage}
                alt="Preview"
                className="jtrip-preview"
              />
            )}
          </div>

          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={jtripForm.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={jtripForm.endDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Duration *</label>
            <input
              type="text"
              name="duration"
              value={jtripForm.duration}
              onChange={handleChange}
              placeholder="e.g., 5 Days 4 Nights"
              required
            />
          </div>

          <div>
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={jtripForm.location}
              onChange={handleChange}
              placeholder="Trip location"
              required
            />
          </div>

          <div>
            <label>Group Size</label>
            <input
              type="text"
              name="groupSize"
              value={jtripForm.groupSize}
              onChange={handleChange}
              placeholder="e.g., Max 12 people"
            />
          </div>

          <div>
            <label>Activity Level</label>
            <input
              type="text"
              name="activityLevel"
              value={jtripForm.activityLevel}
              onChange={handleChange}
              placeholder="e.g., Moderate"
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={jtripForm.description}
              onChange={handleChange}
              placeholder="Trip description"
            />
          </div>

          <div className="jtrip-status">
            <input
              type="checkbox"
              name="isActive"
              checked={jtripForm.isActive}
              onChange={handleChange}
            />
            <label>Active (visible to public)</label>
          </div>

          {/* Highlights */}
          <div className="jtrip-subsection">
            <h5>Highlights</h5>
            {jtripForm.highlights.map((highlight, index) => (
              <div key={index} className="jtrip-subitem-vertical">
                <label>Highlight Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHighlightImageUpload(e, index)}
                  disabled={uploading}
                />
                {highlight.imageUrl && (
                  <div className="jtrip-thumb">
                    <img src={highlight.imageUrl} alt="Highlight" />
                  </div>
                )}
                <textarea
                  placeholder="Highlight text"
                  value={highlight.text}
                  onChange={(e) => {
                    const updated = [...jtripForm.highlights];
                    updated[index].text = e.target.value;
                    setJtripForm({ ...jtripForm, highlights: updated });
                  }}
                  rows="2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = jtripForm.highlights.filter(
                      (_, i) => i !== index
                    );
                    setJtripForm({ ...jtripForm, highlights: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="jtrip-add-mini"
              onClick={addHighlight}
            >
              + Add Highlight
            </button>
          </div>

          {/* Includes */}
          <div className="jtrip-subsection">
            <h5>Includes</h5>
            {jtripForm.includes.map((include, index) => (
              <div key={index} className="jtrip-subitem-vertical">
                <input
                  type="text"
                  placeholder="Include title (e.g., Airport Transfer)"
                  value={include.title}
                  onChange={(e) => {
                    const updated = [...jtripForm.includes];
                    updated[index].title = e.target.value;
                    setJtripForm({ ...jtripForm, includes: updated });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = jtripForm.includes.filter(
                      (_, i) => i !== index
                    );
                    setJtripForm({ ...jtripForm, includes: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="jtrip-add-mini"
              onClick={addInclude}
            >
              + Add Include
            </button>
          </div>

          {/* Excludes */}
          <div className="jtrip-subsection">
            <h5>Excludes</h5>
            {jtripForm.excludes.map((exclude, index) => (
              <div key={index} className="jtrip-subitem-vertical">
                <input
                  type="text"
                  placeholder="Exclude label (e.g., Personal Expenses)"
                  value={exclude.label}
                  onChange={(e) => {
                    const updated = [...jtripForm.excludes];
                    updated[index].label = e.target.value;
                    setJtripForm({ ...jtripForm, excludes: updated });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = jtripForm.excludes.filter(
                      (_, i) => i !== index
                    );
                    setJtripForm({ ...jtripForm, excludes: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="jtrip-add-mini"
              onClick={addExclude}
            >
              + Add Exclude
            </button>
          </div>

          {/* Price Details */}
          <div className="jtrip-subsection">
            <h5>Price Details</h5>
            {jtripForm.priceDetails.map((priceDetail, index) => (
              <div key={index} className="jtrip-subitem-vertical">
                <input
                  type="text"
                  placeholder="Pax (e.g., 2 Pax)"
                  value={priceDetail.pax}
                  onChange={(e) => {
                    const updated = [...jtripForm.priceDetails];
                    updated[index].pax = e.target.value;
                    setJtripForm({ ...jtripForm, priceDetails: updated });
                  }}
                />
                <input
                  type="text"
                  placeholder="Price (e.g., $3,034)"
                  value={priceDetail.price}
                  onChange={(e) => {
                    const updated = [...jtripForm.priceDetails];
                    updated[index].price = e.target.value;
                    setJtripForm({ ...jtripForm, priceDetails: updated });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = jtripForm.priceDetails.filter(
                      (_, i) => i !== index
                    );
                    setJtripForm({ ...jtripForm, priceDetails: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="jtrip-add-mini"
              onClick={addPriceDetail}
            >
              + Add Price Detail
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="jtrip-submit-btn">
            {jtripSelected ? "Update Trip" : "Create Trip"}
          </button>
        </form>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        request={tripToDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default JoindetripTab;

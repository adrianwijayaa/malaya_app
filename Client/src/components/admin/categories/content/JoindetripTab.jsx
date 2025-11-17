import React, { useState, useEffect, useRef } from "react";
import api from "../../../../api/axiosConfig";
import "./JoindetripTab.css";

const JoindetripTab = () => {
  const [trips, setTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("active");
  const [jtripSelected, setJtripSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  const originalHighlightIdsRef = useRef([]);
  const originalIncludeIdsRef = useRef([]);
  const originalExcludeIdsRef = useRef([]);
  const originalPriceDetailIdsRef = useRef([]);

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

  // Fetch all trips from API
  const fetchTrips = async () => {
    try {
      const res = await api.get("/join-trips");
      setTrips(res.data || []);
    } catch {
      showToast("Failed to fetch trips", "error");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Toast notification handler
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJtripForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Hero image upload handler
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
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // Submit handler for create/update trip
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let tripId = jtripForm.id;

      // Save main trip data
      if (tripId) {
        const payload = { ...jtripForm };
        delete payload.highlights;
        delete payload.includes;
        delete payload.excludes;
        delete payload.priceDetails;
        await api.put(`/join-trip/${tripId}`, payload);
      } else {
        const res = await api.post("/join-trip", jtripForm);
        tripId = res.data?.data?.id;
      }

      // Save highlights
      const currentHighlightIds = [];
      for (const highlight of jtripForm.highlights) {
        const body = {
          JoinTripID: tripId,
          imageUrl: highlight.imageUrl,
          text: highlight.text,
          sortOrder: highlight.sortOrder ?? 0,
        };

        if (highlight.id) {
          await api.put(`/join-trip-highlight/${highlight.id}`, body);
          currentHighlightIds.push(highlight.id);
        } else if (highlight.imageUrl || highlight.text) {
          const response = await api.post("/join-trip-highlight", body);
          if (response.data?.data?.id) {
            currentHighlightIds.push(response.data.data.id);
          }
        }
      }

      if (jtripSelected?.id) {
        const highlightsToDelete = originalHighlightIdsRef.current.filter(
          (id) => !currentHighlightIds.includes(id)
        );
        await Promise.all(
          highlightsToDelete.map((id) =>
            api.delete(`/join-trip-highlight/${id}`)
          )
        );
      }

      // Save includes
      const currentIncludeIds = [];
      for (const include of jtripForm.includes) {
        const body = {
          JoinTripID: tripId,
          title: include.title,
          sortOrder: include.sortOrder ?? 0,
        };

        if (include.id) {
          await api.put(`/join-trip-include/${include.id}`, body);
          currentIncludeIds.push(include.id);
        } else if (include.title) {
          const response = await api.post("/join-trip-include", body);
          if (response.data?.data?.id) {
            currentIncludeIds.push(response.data.data.id);
          }
        }
      }

      if (jtripSelected?.id) {
        const includesToDelete = originalIncludeIdsRef.current.filter(
          (id) => !currentIncludeIds.includes(id)
        );
        await Promise.all(
          includesToDelete.map((id) => api.delete(`/join-trip-include/${id}`))
        );
      }

      // Save excludes
      const currentExcludeIds = [];
      for (const exclude of jtripForm.excludes) {
        const body = {
          JoinTripID: tripId,
          label: exclude.label,
          sortOrder: exclude.sortOrder ?? 0,
        };

        if (exclude.id) {
          await api.put(`/join-trip-exclude/${exclude.id}`, body);
          currentExcludeIds.push(exclude.id);
        } else if (exclude.label) {
          const response = await api.post("/join-trip-exclude", body);
          if (response.data?.data?.id) {
            currentExcludeIds.push(response.data.data.id);
          }
        }
      }

      if (jtripSelected?.id) {
        const excludesToDelete = originalExcludeIdsRef.current.filter(
          (id) => !currentExcludeIds.includes(id)
        );
        await Promise.all(
          excludesToDelete.map((id) => api.delete(`/join-trip-exclude/${id}`))
        );
      }

      // Save price details
      const currentPriceDetailIds = [];
      for (const priceDetail of jtripForm.priceDetails) {
        const body = {
          JoinTripID: tripId,
          pax: priceDetail.pax,
          price: priceDetail.price,
          sortOrder: priceDetail.sortOrder ?? 0,
        };

        if (priceDetail.id) {
          await api.put(`/join-trip-price-detail/${priceDetail.id}`, body);
          currentPriceDetailIds.push(priceDetail.id);
        } else if (priceDetail.pax && priceDetail.price) {
          const response = await api.post("/join-trip-price-detail", body);
          if (response.data?.data?.id) {
            currentPriceDetailIds.push(response.data.data.id);
          }
        }
      }

      if (jtripSelected?.id) {
        const priceDetailsToDelete = originalPriceDetailIdsRef.current.filter(
          (id) => !currentPriceDetailIds.includes(id)
        );
        await Promise.all(
          priceDetailsToDelete.map((id) =>
            api.delete(`/join-trip-price-detail/${id}`)
          )
        );
      }

      showToast(
        tripId === jtripForm.id
          ? "Trip updated successfully"
          : "Trip created successfully"
      );
      fetchTrips();
      closeDrawer();
    } catch (error) {
      console.error("Save error:", error);
      showToast("Failed to save trip", "error");
    }
  };

  // Open drawer for editing or creating new trip
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
          (item) => item.id
        );
        originalIncludeIdsRef.current = (data.includes || []).map(
          (item) => item.id
        );
        originalExcludeIdsRef.current = (data.excludes || []).map(
          (item) => item.id
        );
        originalPriceDetailIdsRef.current = (data.priceDetails || []).map(
          (item) => item.id
        );
      } catch {
        showToast("Failed to load trip details", "error");
      }
    } else {
      resetForm();
    }
  };

  // Close drawer and reset form
  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setJtripSelected(null);
      resetForm();
    }, 300);
  };

  // Reset form to initial state
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

  // Confirm delete modal
  const confirmDelete = (trip) => {
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  // Delete trip handler
  const handleDelete = async () => {
    try {
      await api.delete(`/join-trip/${tripToDelete.id}`);
      showToast("Trip deleted successfully");
      fetchTrips();
    } catch {
      showToast("Failed to delete trip", "error");
    } finally {
      setShowDeleteModal(false);
      setTripToDelete(null);
    }
  };

  // Add new highlight
  const addHighlight = () => {
    setJtripForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { imageUrl: "", text: "" }],
    }));
  };

  // Add new include
  const addInclude = () => {
    setJtripForm((prev) => ({
      ...prev,
      includes: [...prev.includes, { title: "" }],
    }));
  };

  // Add new exclude
  const addExclude = () => {
    setJtripForm((prev) => ({
      ...prev,
      excludes: [...prev.excludes, { label: "" }],
    }));
  };

  // Add new price detail row
  const addPriceDetail = () => {
    setJtripForm((prev) => ({
      ...prev,
      priceDetails: [...prev.priceDetails, { pax: "", price: "" }],
    }));
  };

  // Filter trips based on active status
  const filteredTrips = trips.filter((trip) =>
    activeFilter === "active" ? trip.isActive : !trip.isActive
  );

  return (
    <div className="jtrip-container">
      {toast && <div className={`jtrip-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Header Section */}
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

      {/* Table Section */}
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
          <h4>{jtripSelected ? "Edit Trip" : "Add New Trip"}</h4>
          <button onClick={closeDrawer} className="jtrip-close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="jtrip-form">
          {/* Basic Information */}
          <label>
            <span>Title *</span>
            <input
              name="title"
              value={jtripForm.title}
              onChange={handleChange}
              placeholder="Enter trip title"
              required
            />
          </label>

          <label>
            <span>Subtitle</span>
            <input
              name="subtitle"
              value={jtripForm.subtitle}
              onChange={handleChange}
              placeholder="Enter trip subtitle"
            />
          </label>

          <label>
            <span>Status</span>
            <div className="jtrip-checkbox-wrapper">
              <input
                type="checkbox"
                name="isActive"
                checked={jtripForm.isActive}
                onChange={handleChange}
                id="isActive"
              />
              <label htmlFor="isActive">
                {jtripForm.isActive ? "Active" : "Archived"}
              </label>
            </div>
          </label>

          <label>
            <span>Hero Image *</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <p className="jtrip-upload-status">Uploading...</p>}
            {jtripForm.heroImage && (
              <img
                src={jtripForm.heroImage}
                alt="Hero preview"
                className="jtrip-image-preview"
              />
            )}
          </label>

          <label>
            <span>Description</span>
            <textarea
              name="description"
              value={jtripForm.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter trip description"
            />
          </label>

          {/* Trip Dates */}
          <div className="jtrip-date-row">
            <label>
              <span>Start Date</span>
              <input
                type="date"
                name="startDate"
                value={jtripForm.startDate}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>End Date</span>
              <input
                type="date"
                name="endDate"
                value={jtripForm.endDate}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            <span>Duration *</span>
            <input
              name="duration"
              value={jtripForm.duration}
              onChange={handleChange}
              placeholder="e.g., 5 Days 4 Nights"
              required
            />
          </label>

          <label>
            <span>Location *</span>
            <input
              name="location"
              value={jtripForm.location}
              onChange={handleChange}
              placeholder="e.g., Bali, Indonesia"
              required
            />
          </label>

          <label>
            <span>Group Size</span>
            <input
              name="groupSize"
              value={jtripForm.groupSize}
              onChange={handleChange}
              placeholder="e.g., 8-12 people"
            />
          </label>

          <label>
            <span>Activity Level</span>
            <select
              name="activityLevel"
              value={jtripForm.activityLevel}
              onChange={handleChange}
            >
              <option value="">Select activity level</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </label>

          {/* Highlights Section */}
          <div className="jtrip-section">
            <div className="jtrip-section-header">
              <h5>Highlights</h5>
              <button
                type="button"
                className="jtrip-add-btn"
                onClick={addHighlight}
              >
                + Add Highlight
              </button>
            </div>
            {jtripForm.highlights.map((highlight, index) => (
              <div key={highlight.id ?? index} className="jtrip-item">
                <input
                  type="text"
                  placeholder="Highlight description"
                  value={highlight.text}
                  onChange={(e) => {
                    const updated = [...jtripForm.highlights];
                    updated[index].text = e.target.value;
                    setJtripForm({ ...jtripForm, highlights: updated });
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    try {
                      const formData = new FormData();
                      formData.append("image", file);
                      const response = await api.post(
                        "/upload-image",
                        formData,
                        {
                          headers: { "Content-Type": "multipart/form-data" },
                        }
                      );
                      const updated = [...jtripForm.highlights];
                      updated[index].imageUrl = response.data.url;
                      setJtripForm({ ...jtripForm, highlights: updated });
                      showToast("Highlight image uploaded");
                    } catch {
                      showToast("Image upload failed", "error");
                    }
                  }}
                />
                <button
                  type="button"
                  className="jtrip-delete-btn"
                  onClick={() => {
                    const updated = jtripForm.highlights.filter(
                      (_, idx) => idx !== index
                    );
                    setJtripForm({ ...jtripForm, highlights: updated });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Includes Section */}
          <div className="jtrip-section">
            <div className="jtrip-section-header">
              <h5>What's Included</h5>
              <button
                type="button"
                className="jtrip-add-btn"
                onClick={addInclude}
              >
                + Add Include
              </button>
            </div>
            {jtripForm.includes.map((include, index) => (
              <div key={include.id ?? index} className="jtrip-item">
                <input
                  type="text"
                  placeholder="e.g., Accommodation, Meals"
                  value={include.title}
                  onChange={(e) => {
                    const updated = [...jtripForm.includes];
                    updated[index].title = e.target.value;
                    setJtripForm({ ...jtripForm, includes: updated });
                  }}
                />
                <button
                  type="button"
                  className="jtrip-delete-btn"
                  onClick={() => {
                    const updated = jtripForm.includes.filter(
                      (_, idx) => idx !== index
                    );
                    setJtripForm({ ...jtripForm, includes: updated });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Excludes Section */}
          <div className="jtrip-section">
            <div className="jtrip-section-header">
              <h5>What's Excluded</h5>
              <button
                type="button"
                className="jtrip-add-btn"
                onClick={addExclude}
              >
                + Add Exclude
              </button>
            </div>
            {jtripForm.excludes.map((exclude, index) => (
              <div key={exclude.id ?? index} className="jtrip-item">
                <input
                  type="text"
                  placeholder="e.g., International flights"
                  value={exclude.label}
                  onChange={(e) => {
                    const updated = [...jtripForm.excludes];
                    updated[index].label = e.target.value;
                    setJtripForm({ ...jtripForm, excludes: updated });
                  }}
                />
                <button
                  type="button"
                  className="jtrip-delete-btn"
                  onClick={() => {
                    const updated = jtripForm.excludes.filter(
                      (_, idx) => idx !== index
                    );
                    setJtripForm({ ...jtripForm, excludes: updated });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Price Details Section */}
          <div className="jtrip-section">
            <div className="jtrip-section-header">
              <h5>Price Details</h5>
              <button
                type="button"
                className="jtrip-add-btn"
                onClick={addPriceDetail}
              >
                + Add Price Row
              </button>
            </div>
            {jtripForm.priceDetails.map((priceDetail, index) => (
              <div
                key={priceDetail.id ?? index}
                className="jtrip-item jtrip-price-item"
              >
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
                  className="jtrip-delete-btn"
                  onClick={() => {
                    const updated = jtripForm.priceDetails.filter(
                      (_, idx) => idx !== index
                    );
                    setJtripForm({ ...jtripForm, priceDetails: updated });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit" className="jtrip-submit-btn">
            {jtripSelected ? "Update Trip" : "Create Trip"}
          </button>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="jtrip-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="jtrip-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Delete Trip</h4>
            <p>Are you sure you want to delete "{tripToDelete?.title}"?</p>
            <p className="jtrip-modal-warning">This action cannot be undone.</p>
            <div className="jtrip-modal-actions">
              <button
                className="jtrip-modal-btn cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="jtrip-modal-btn delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoindetripTab;

import React, { useState, useEffect, useRef } from "react";
import api, { BASE_URL } from "../../../../api/axiosConfig";
import DeleteModal from "../../modals/DeleteModal";
import "./TailormadeTripTab.css";
import { useLenis } from "lenis/react";

const TailormadeTripTab = () => {
  const lenis = useLenis();

  // Helper function untuk preview image
  const imageSrc = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const base = BASE_URL?.replace(/\/+$/, "") || "";
    const path = String(url).startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  // State management
  const [trips, setTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("active");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Refs for tracking original IDs
  const originalHighlightIds = useRef([]);
  const originalIncludeIds = useRef([]);
  const originalExcludeIds = useRef([]);
  const originalFactIds = useRef([]);
  const originalPriceDetailIds = useRef([]);

  // Form state
  const [form, setForm] = useState({
    id: null,
    title: "",
    slug: "",
    heroImage: "",
    overview: "",
    bestSeasonStart: "",
    bestSeasonEnd: "",
    idealPaxMin: "",
    idealPaxMax: "",
    pace: "Balanced",
    isActive: true,
    startDate: "",
    endDate: "",
    highlights: [],
    includes: [],
    excludes: [],
    facts: [],
    priceDetails: [],
  });

  useEffect(() => {
    if (drawerOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [drawerOpen, lenis]);

  // ===== Helpers =====
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sanitize currency-like input to a plain decimal string (ke BE: STRING angka mentah)
  const sanitizeMoney = (v) => {
    const s = String(v ?? "");
    const cleaned = s.replace(/[^\d.,-]/g, "").replace(/,/g, ".");
    const parts = cleaned.split(".");
    return parts.length > 2
      ? `${parts[0]}.${parts.slice(1).join("")}`
      : cleaned;
  };

  // ===== Effects =====
  useEffect(() => {
    fetchTrips();
  }, []);

  // ===== API =====
  const fetchTrips = async () => {
    try {
      const res = await api.get("/tailor-trips");
      setTrips(res.data || []);
    } catch (error) {
      showToast("Failed to fetch trips", "error");
    }
  };

  // ===== Handlers =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
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
      const token = localStorage.getItem("adminToken");
      const res = await api.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      setForm((prev) => ({ ...prev, heroImage: res.data.url }));
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
      const token = localStorage.getItem("adminToken");
      const res = await api.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const updated = [...form.highlights];
      updated[index].imageUrl = res.data.url;
      setForm({ ...form, highlights: updated });
      showToast("Highlight image uploaded successfully");
    } catch (error) {
      showToast("Highlight image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let tripId = form.id;

      // Save main trip data (tanpa relasi)
      if (tripId) {
        const payload = { ...form };
        delete payload.highlights;
        delete payload.includes;
        delete payload.excludes;
        delete payload.facts;
        delete payload.priceDetails;
        await api.put(`/tailor-trip/${tripId}`, payload);
      } else {
        const res = await api.post("/tailor-trip", form);
        tripId = res.data?.data?.id;
      }

      // Save relations
      await saveHighlights(tripId);
      await saveIncludes(tripId);
      await saveExcludes(tripId);
      await saveFacts(tripId);
      await savePriceDetails(tripId); // ⬅️ price dijadikan STRING angka mentah

      showToast(
        form.id ? "Trip updated successfully" : "Trip created successfully"
      );
      fetchTrips();
      closeDrawer();
    } catch (error) {
      console.error("Save error:", error);
      showToast("Failed to save trip", "error");
    }
  };

  const saveHighlights = async (tripId) => {
    const currentIds = [];

    for (const highlight of form.highlights) {
      const body = {
        TripID: tripId,
        imageUrl: highlight.imageUrl,
        caption: highlight.caption,
        sortOrder: highlight.sortOrder ?? 0,
      };

      if (highlight.id) {
        await api.put(`/tailor-trip-highlight/${highlight.id}`, body);
        currentIds.push(highlight.id);
      } else if (highlight.imageUrl || highlight.caption) {
        const response = await api.post("/tailor-trip-highlight", body);
        if (response.data?.data?.id) currentIds.push(response.data.data.id);
      }
    }

    if (selectedTrip?.id) {
      const toDelete = originalHighlightIds.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/tailor-trip-highlight/${id}`))
      );
    }
  };

  const saveIncludes = async (tripId) => {
    const currentIds = [];

    for (const include of form.includes) {
      const body = {
        TripID: tripId,
        label: include.label,
        sortOrder: include.sortOrder ?? 0,
      };

      if (include.id) {
        await api.put(`/tailor-trip-include/${include.id}`, body);
        currentIds.push(include.id);
      } else if (include.label) {
        const response = await api.post("/tailor-trip-include", body);
        if (response.data?.data?.id) currentIds.push(response.data.data.id);
      }
    }

    if (selectedTrip?.id) {
      const toDelete = originalIncludeIds.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/tailor-trip-include/${id}`))
      );
    }
  };

  const saveExcludes = async (tripId) => {
    const currentIds = [];

    for (const exclude of form.excludes) {
      const body = {
        TripID: tripId,
        label: exclude.label,
        sortOrder: exclude.sortOrder ?? 0,
      };

      if (exclude.id) {
        await api.put(`/tailor-trip-exclude/${exclude.id}`, body);
        currentIds.push(exclude.id);
      } else if (exclude.label) {
        const response = await api.post("/tailor-trip-exclude", body);
        if (response.data?.data?.id) currentIds.push(response.data.data.id);
      }
    }

    if (selectedTrip?.id) {
      const toDelete = originalExcludeIds.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/tailor-trip-exclude/${id}`))
      );
    }
  };

  const saveFacts = async (tripId) => {
    const currentIds = [];

    for (const fact of form.facts) {
      const body = {
        TripID: tripId,
        key: fact.key,
        value: fact.value,
        sortOrder: fact.sortOrder ?? 0,
      };

      if (fact.id) {
        await api.put(`/tailor-trip-fact/${fact.id}`, body);
        currentIds.push(fact.id);
      } else if (fact.key && fact.value) {
        const response = await api.post("/tailor-trip-fact", body);
        if (response.data?.data?.id) currentIds.push(response.data.data.id);
      }
    }

    if (selectedTrip?.id) {
      const toDelete = originalFactIds.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/tailor-trip-fact/${id}`))
      );
    }
  };

  const savePriceDetails = async (tripId) => {
    const currentIds = [];

    for (const priceDetail of form.priceDetails) {
      const body = {
        TripID: tripId,
        pax: String(priceDetail.pax || ""),
        price: String(sanitizeMoney(priceDetail.price || "")), // ⬅️ kirim sebagai STRING angka mentah
        sortOrder: Number(priceDetail.sortOrder ?? 0),
      };

      if (priceDetail.id) {
        await api.put(`/tailor-trip-price-detail/${priceDetail.id}`, body);
        currentIds.push(priceDetail.id);
      } else if (priceDetail.pax && priceDetail.price) {
        const response = await api.post("/tailor-trip-price-detail", body);
        if (response.data?.data?.id) currentIds.push(response.data.data.id);
      }
    }

    if (selectedTrip?.id) {
      const toDelete = originalPriceDetailIds.current.filter(
        (id) => !currentIds.includes(id)
      );
      await Promise.all(
        toDelete.map((id) => api.delete(`/tailor-trip-price-detail/${id}`))
      );
    }
  };

  // Drawer functions
  const openDrawer = async (trip = null) => {
    setDrawerOpen(true);

    if (trip) {
      try {
        const res = await api.get(`/tailor-trip/${trip.id}`);
        const data = res.data?.data;
        setSelectedTrip(data);

        setForm({
          id: data.id,
          title: data.title || "",
          slug: data.slug || "",
          heroImage: data.heroImage || "",
          overview: data.overview || "",
          bestSeasonStart: data.bestSeasonStart || "",
          bestSeasonEnd: data.bestSeasonEnd || "",
          idealPaxMin: data.idealPaxMin || "",
          idealPaxMax: data.idealPaxMax || "",
          pace: data.pace || "Balanced",
          isActive: !!data.isActive,
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          highlights: (data.highlights || []).map((item) => ({
            id: item.id,
            imageUrl: item.imageUrl || "",
            caption: item.caption || "",
            sortOrder: item.sortOrder ?? 0,
          })),
          includes: (data.includes || []).map((item) => ({
            id: item.id,
            label: item.label || "",
            sortOrder: item.sortOrder ?? 0,
          })),
          excludes: (data.excludes || []).map((item) => ({
            id: item.id,
            label: item.label || "",
            sortOrder: item.sortOrder ?? 0,
          })),
          facts: (data.facts || []).map((item) => ({
            id: item.id,
            key: item.key || "Accommodation",
            value: item.value || "",
            sortOrder: item.sortOrder ?? 0,
          })),
          priceDetails: (data.priceDetails || []).map((item) => ({
            id: item.id,
            pax: item.pax || "",
            price: item.price || "", // UI tampil apa adanya; disanitasi saat submit
            sortOrder: item.sortOrder ?? 0,
          })),
        });

        originalHighlightIds.current = (data.highlights || []).map((i) => i.id);
        originalIncludeIds.current = (data.includes || []).map((i) => i.id);
        originalExcludeIds.current = (data.excludes || []).map((i) => i.id);
        originalFactIds.current = (data.facts || []).map((i) => i.id);
        originalPriceDetailIds.current = (data.priceDetails || []).map(
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
      setSelectedTrip(null);
      resetForm();
    }, 300);
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      slug: "",
      heroImage: "",
      overview: "",
      bestSeasonStart: "",
      bestSeasonEnd: "",
      idealPaxMin: "",
      idealPaxMax: "",
      pace: "Balanced",
      isActive: true,
      startDate: "",
      endDate: "",
      highlights: [],
      includes: [],
      excludes: [],
      facts: [],
      priceDetails: [],
    });

    originalHighlightIds.current = [];
    originalIncludeIds.current = [];
    originalExcludeIds.current = [];
    originalFactIds.current = [];
    originalPriceDetailIds.current = [];
  };

  // Delete handlers
  const confirmDelete = (trip) => {
    setTripToDelete({
      ...trip,
      fullname: trip.title,
      email: trip.slug,
      status: trip.isActive ? "Active" : "Archived",
    });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tailor-trip/${tripToDelete.id}`);
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
    setForm((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        { imageUrl: "", caption: "", sortOrder: 0 },
      ],
    }));
  };

  const addInclude = () => {
    setForm((prev) => ({
      ...prev,
      includes: [...prev.includes, { label: "", sortOrder: 0 }],
    }));
  };

  const addExclude = () => {
    setForm((prev) => ({
      ...prev,
      excludes: [...prev.excludes, { label: "", sortOrder: 0 }],
    }));
  };

  const addFact = () => {
    setForm((prev) => ({
      ...prev,
      facts: [...prev.facts, { key: "Accommodation", value: "", sortOrder: 0 }],
    }));
  };

  const addPriceDetail = () => {
    setForm((prev) => ({
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
    <div className="ttrip-container">
      {/* Toast Notification */}
      {toast && <div className={`ttrip-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <header className="ttrip-header">
        <div className="ttrip-header-left">
          <h3>Tailormade Trip Management</h3>
          <div className="ttrip-tabs">
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
        <button className="ttrip-btn-add" onClick={() => openDrawer()}>
          + Add New Trip
        </button>
      </header>

      {/* Table */}
      <div className="ttrip-table-wrapper">
        <table className="ttrip-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Pace</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.title}</td>
                <td>{trip.slug}</td>
                <td>{trip.pace}</td>
                <td>
                  <span
                    className={`ttrip-status-badge ${
                      trip.isActive ? "active" : "inactive"
                    }`}
                  >
                    {trip.isActive ? "Active" : "Archived"}
                  </span>
                </td>
                <td>
                  <button
                    className="ttrip-action-btn edit"
                    onClick={() => openDrawer(trip)}
                  >
                    Edit
                  </button>
                  <button
                    className="ttrip-action-btn delete"
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
      <div
        className={`ttrip-drawer ${drawerOpen ? "open" : ""}`}
        data-lenis-prevent
      >
        <div className="ttrip-drawer-header">
          <h4>{selectedTrip ? "Edit Trip" : "Create New Trip"}</h4>
          <button onClick={closeDrawer}>×</button>
        </div>

        <form className="ttrip-form" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div>
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Trip title"
              required
            />
          </div>

          <div>
            <label>Slug *</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="trip-slug"
              required
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
            {form.heroImage && (
              <img
                src={imageSrc(form.heroImage)}
                alt="Preview"
                className="ttrip-preview"
              />
            )}
          </div>

          <div>
            <label>Overview *</label>
            <textarea
              name="overview"
              value={form.overview}
              onChange={handleChange}
              placeholder="Trip overview"
              required
            />
          </div>

          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Best Season Start</label>
            <input
              type="text"
              name="bestSeasonStart"
              value={form.bestSeasonStart}
              onChange={handleChange}
              placeholder="e.g., April"
            />
          </div>

          <div>
            <label>Best Season End</label>
            <input
              type="text"
              name="bestSeasonEnd"
              value={form.bestSeasonEnd}
              onChange={handleChange}
              placeholder="e.g., October"
            />
          </div>

          <div>
            <label>Ideal Pax Min</label>
            <input
              type="number"
              name="idealPaxMin"
              min={0}
              step={1}
              value={form.idealPaxMin}
              onChange={handleChange}
              placeholder="Minimum participants"
            />
          </div>

          <div>
            <label>Ideal Pax Max</label>
            <input
              type="number"
              name="idealPaxMax"
              min={0}
              step={1}
              value={form.idealPaxMax}
              onChange={handleChange}
              placeholder="Maximum participants"
            />
          </div>

          <div>
            <label>Pace</label>
            <select name="pace" value={form.pace} onChange={handleChange}>
              <option>Relaxed</option>
              <option>Balanced</option>
              <option>Active</option>
            </select>
          </div>

          <div className="ttrip-status">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <label>Active (visible to public)</label>
          </div>

          {/* Highlights */}
          <div className="ttrip-subsection">
            <h5>Highlights</h5>
            {form.highlights.map((highlight, index) => (
              <div key={index} className="ttrip-subitem-vertical">
                <label>Highlight Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHighlightImageUpload(e, index)}
                  disabled={uploading}
                />
                {highlight.imageUrl && (
                  <div className="ttrip-thumb">
                    <img src={imageSrc(highlight.imageUrl)} alt="Highlight" />
                  </div>
                )}
                <textarea
                  placeholder="Caption"
                  value={highlight.caption}
                  onChange={(e) => {
                    const updated = [...form.highlights];
                    updated[index].caption = e.target.value;
                    setForm({ ...form, highlights: updated });
                  }}
                  rows="2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = form.highlights.filter(
                      (_, i) => i !== index
                    );
                    setForm({ ...form, highlights: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ttrip-add-mini"
              onClick={addHighlight}
            >
              + Add Highlight
            </button>
          </div>

          {/* Includes */}
          <div className="ttrip-subsection">
            <h5>What's Included</h5>
            {form.includes.map((include, index) => (
              <div key={index} className="ttrip-subitem-vertical">
                <input
                  type="text"
                  placeholder="e.g., Professional guide"
                  value={include.label}
                  onChange={(e) => {
                    const updated = [...form.includes];
                    updated[index].label = e.target.value;
                    setForm({ ...form, includes: updated });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = form.includes.filter((_, i) => i !== index);
                    setForm({ ...form, includes: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ttrip-add-mini"
              onClick={addInclude}
            >
              + Add Include
            </button>
          </div>

          {/* Excludes */}
          <div className="ttrip-subsection">
            <h5>What's Excluded</h5>
            {form.excludes.map((exclude, index) => (
              <div key={index} className="ttrip-subitem-vertical">
                <input
                  type="text"
                  placeholder="e.g., International flights"
                  value={exclude.label}
                  onChange={(e) => {
                    const updated = [...form.excludes];
                    updated[index].label = e.target.value;
                    setForm({ ...form, excludes: updated });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = form.excludes.filter((_, i) => i !== index);
                    setForm({ ...form, excludes: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ttrip-add-mini"
              onClick={addExclude}
            >
              + Add Exclude
            </button>
          </div>

          {/* Facts */}
          <div className="ttrip-subsection">
            <h5>Trip Facts</h5>
            {form.facts.map((fact, index) => (
              <div key={index} className="ttrip-subitem-vertical">
                <select
                  value={fact.key}
                  onChange={(e) => {
                    const updated = [...form.facts];
                    updated[index].key = e.target.value;
                    setForm({ ...form, facts: updated });
                  }}
                >
                  <option>Accommodation</option>
                  <option>Experience</option>
                  <option>Safety</option>
                  <option>Duration</option>
                  <option>Group Size</option>
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={fact.value}
                  onChange={(e) => {
                    const updated = [...form.facts];
                    updated[index].value = e.target.value;
                    setForm({ ...form, facts: updated });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = form.facts.filter((_, i) => i !== index);
                    setForm({ ...form, facts: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="ttrip-add-mini" onClick={addFact}>
              + Add Fact
            </button>
          </div>

          {/* Price Details */}
          <div className="ttrip-subsection">
            <h5>Price Details</h5>
            {form.priceDetails.map((priceDetail, index) => (
              <div key={index} className="ttrip-subitem-vertical">
                <input
                  type="text"
                  placeholder="Pax (e.g., 2 pax or 2–4 pax)"
                  value={priceDetail.pax}
                  onChange={(e) => {
                    const updated = [...form.priceDetails];
                    updated[index].pax = e.target.value;
                    setForm({ ...form, priceDetails: updated });
                  }}
                />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Price (e.g., 3034.50)"
                  value={priceDetail.price}
                  onChange={(e) => {
                    const updated = [...form.priceDetails];
                    // Simpan apa adanya di UI; disanitasi ketika submit
                    updated[index].price = e.target.value;
                    setForm({ ...form, priceDetails: updated });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = form.priceDetails.filter(
                      (_, i) => i !== index
                    );
                    setForm({ ...form, priceDetails: updated });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ttrip-add-mini"
              onClick={addPriceDetail}
            >
              + Add Price Detail
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="ttrip-submit-btn">
            {selectedTrip ? "Update Trip" : "Create Trip"}
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

export default TailormadeTripTab;

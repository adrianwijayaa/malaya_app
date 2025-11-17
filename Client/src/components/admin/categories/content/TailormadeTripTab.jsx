import React, { useState, useEffect, useRef } from "react";
import api from "../../../../api/axiosConfig";
import "./TailormadeTripTab.css";

const TailormadeTripTab = () => {
  const [trips, setTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("active");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  const originalHighlightIds = useRef([]);
  const originalIncludeIds = useRef([]);
  const originalExcludeIds = useRef([]);
  const originalFactIds = useRef([]);
  const originalPriceDetailIds = useRef([]);

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

  const fetchTrips = async () => {
    try {
      const res = await api.get("/tailor-trips");
      setTrips(res.data || []);
    } catch {
      showToast("Failed to fetch trips", "error");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
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
      setForm((p) => ({ ...p, heroImage: res.data.url }));
      showToast("Image uploaded");
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let tripId = form.id;

      // Parent trip
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

      // Highlights
      const currentHighlightIds = [];
      for (const h of form.highlights) {
        const body = {
          TripID: tripId,
          imageUrl: h.imageUrl,
          caption: h.caption,
          sortOrder: h.sortOrder ?? 0,
        };
        if (h.id) {
          await api.put(`/tailor-trip-highlight/${h.id}`, body);
          currentHighlightIds.push(h.id);
        } else if (h.imageUrl || h.caption) {
          const r = await api.post("/tailor-trip-highlight", body);
          if (r.data?.data?.id) currentHighlightIds.push(r.data.data.id);
        }
      }
      if (selectedTrip?.id) {
        const toDelete = originalHighlightIds.current.filter(
          (id) => !currentHighlightIds.includes(id)
        );
        await Promise.all(
          toDelete.map((id) => api.delete(`/tailor-trip-highlight/${id}`))
        );
      }

      // Includes
      const currentIncludeIds = [];
      for (const inc of form.includes) {
        const body = {
          TripID: tripId,
          label: inc.label,
          sortOrder: inc.sortOrder ?? 0,
        };
        if (inc.id) {
          await api.put(`/tailor-trip-include/${inc.id}`, body);
          currentIncludeIds.push(inc.id);
        } else if (inc.label) {
          const r = await api.post("/tailor-trip-include", body);
          if (r.data?.data?.id) currentIncludeIds.push(r.data.data.id);
        }
      }
      if (selectedTrip?.id) {
        const toDelete = originalIncludeIds.current.filter(
          (id) => !currentIncludeIds.includes(id)
        );
        await Promise.all(
          toDelete.map((id) => api.delete(`/tailor-trip-include/${id}`))
        );
      }

      // Excludes
      const currentExcludeIds = [];
      for (const exc of form.excludes) {
        const body = {
          TripID: tripId,
          label: exc.label,
          sortOrder: exc.sortOrder ?? 0,
        };
        if (exc.id) {
          await api.put(`/tailor-trip-exclude/${exc.id}`, body);
          currentExcludeIds.push(exc.id);
        } else if (exc.label) {
          const r = await api.post("/tailor-trip-exclude", body);
          if (r.data?.data?.id) currentExcludeIds.push(r.data.data.id);
        }
      }
      if (selectedTrip?.id) {
        const toDelete = originalExcludeIds.current.filter(
          (id) => !currentExcludeIds.includes(id)
        );
        await Promise.all(
          toDelete.map((id) => api.delete(`/tailor-trip-exclude/${id}`))
        );
      }

      // Price Details
      const currentPriceDetailIds = [];
      for (const pd of form.priceDetails) {
        const body = {
          TripID: tripId,
          pax: pd.pax,
          price: pd.price,
          sortOrder: pd.sortOrder ?? 0,
        };
        if (pd.id) {
          await api.put(`/tailor-trip-price-detail/${pd.id}`, body);
          currentPriceDetailIds.push(pd.id);
        } else if (pd.pax && pd.price) {
          const r = await api.post("/tailor-trip-price-detail", body);
          if (r.data?.data?.id) currentPriceDetailIds.push(r.data.data.id);
        }
      }
      if (selectedTrip?.id) {
        const toDelete = originalPriceDetailIds.current.filter(
          (id) => !currentPriceDetailIds.includes(id)
        );
        await Promise.all(
          toDelete.map((id) => api.delete(`/tailor-trip-price-detail/${id}`))
        );
      }

      // Facts
      const currentFactIds = [];
      for (const f of form.facts) {
        const body = { TripID: tripId, key: f.key, value: f.value };
        if (f.id) {
          await api.put(`/tailor-trip-fact/${f.id}`, body);
          currentFactIds.push(f.id);
        } else if (f.key && f.value) {
          const r = await api.post("/tailor-trip-fact", body);
          if (r.data?.data?.id) currentFactIds.push(r.data.data.id);
        }
      }
      if (selectedTrip?.id) {
        const toDelete = originalFactIds.current.filter(
          (id) => !currentFactIds.includes(id)
        );
        await Promise.all(
          toDelete.map((id) => api.delete(`/tailor-trip-fact/${id}`))
        );
      }

      showToast(tripId === form.id ? "Trip updated" : "Trip created");
      fetchTrips();
      closeDrawer();
    } catch {
      showToast("Save failed", "error");
    }
  };

  const openDrawer = async (trip = null) => {
    setDrawerOpen(true);
    if (trip) {
      try {
        const res = await api.get(`/tailor-trip/${trip.id}`);
        const d = res.data.data;
        setSelectedTrip(d);
        setForm({
          id: d.id,
          title: d.title,
          slug: d.slug,
          heroImage: d.heroImage,
          overview: d.overview,
          bestSeasonStart: d.bestSeasonStart || "",
          bestSeasonEnd: d.bestSeasonEnd || "",
          idealPaxMin: d.idealPaxMin || "",
          idealPaxMax: d.idealPaxMax || "",
          pace: d.pace || "Balanced",
          isActive: !!d.isActive,
          startDate: d.startDate || "",
          endDate: d.endDate || "",
          highlights: d.highlights || [],
          includes: d.includes || [],
          excludes: d.excludes || [],
          facts: d.facts || [],
          priceDetails: d.priceDetails || [],
        });
        originalHighlightIds.current = (d.highlights || []).map((x) => x.id);
        originalIncludeIds.current = (d.includes || []).map((x) => x.id);
        originalExcludeIds.current = (d.excludes || []).map((x) => x.id);
        originalFactIds.current = (d.facts || []).map((x) => x.id);
        originalPriceDetailIds.current = (d.priceDetails || []).map(
          (x) => x.id
        );
      } catch {
        showToast("Failed to load trip details", "error");
      }
    } else resetForm();
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedTrip(null);
      resetForm();
    }, 300);
  };

  const resetForm = () =>
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

  const confirmDelete = (trip) => {
    setTripToDelete(trip);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tailor-trip/${tripToDelete.id}`);
      showToast("Trip deleted");
      fetchTrips();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteModal(false);
      setTripToDelete(null);
    }
  };

  const addHighlight = () =>
    setForm((p) => ({
      ...p,
      highlights: [...p.highlights, { imageUrl: "", caption: "" }],
    }));
  const addInclude = () =>
    setForm((p) => ({ ...p, includes: [...p.includes, { label: "" }] }));
  const addExclude = () =>
    setForm((p) => ({ ...p, excludes: [...p.excludes, { label: "" }] }));
  const addFact = () =>
    setForm((p) => ({
      ...p,
      facts: [...p.facts, { key: "Accommodation", value: "" }],
    }));
  const addPriceDetail = () =>
    setForm((p) => ({
      ...p,
      priceDetails: [...p.priceDetails, { pax: "", price: "" }],
    }));

  const filteredTrips = trips.filter((t) =>
    activeFilter === "active" ? t.isActive : !t.isActive
  );

  return (
    <div className="ttrip-container">
      {toast && <div className={`ttrip-toast ${toast.type}`}>{toast.msg}</div>}

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

      <div className="ttrip-table-wrapper">
        <table className="ttrip-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.title}</td>
                <td>{trip.slug}</td>
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

      {/* DRAWER FORM */}
      <div className={`ttrip-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="ttrip-drawer-header">
          <h4>{selectedTrip ? "Edit Trip" : "Add New Trip"}</h4>
          <button onClick={closeDrawer}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="ttrip-form">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
          />

          <label>Status</label>
          <div className="ttrip-status">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>{form.isActive ? "Active" : "Archived"}</span>
          </div>

          <label>Hero Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p>Uploading...</p>}
          {form.heroImage && (
            <img
              src={form.heroImage}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}

          <label>Overview</label>
          <textarea
            name="overview"
            value={form.overview}
            onChange={handleChange}
            rows="4"
          />

          <label>Trip Dates</label>
          <div className="ttrip-inline">
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.85rem", color: "#666" }}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.85rem", color: "#666" }}>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Best Season</label>
          <div className="ttrip-inline">
            <input
              name="bestSeasonStart"
              placeholder="Start (e.g., April)"
              value={form.bestSeasonStart}
              onChange={handleChange}
            />
            <input
              name="bestSeasonEnd"
              placeholder="End (e.g., October)"
              value={form.bestSeasonEnd}
              onChange={handleChange}
            />
          </div>

          <label>Ideal Pax</label>
          <div className="ttrip-inline">
            <input
              name="idealPaxMin"
              type="number"
              placeholder="Min"
              value={form.idealPaxMin}
              onChange={handleChange}
            />
            <input
              name="idealPaxMax"
              type="number"
              placeholder="Max"
              value={form.idealPaxMax}
              onChange={handleChange}
            />
          </div>

          <label>Pace</label>
          <select name="pace" value={form.pace} onChange={handleChange}>
            <option>Relaxed</option>
            <option>Balanced</option>
            <option>Active</option>
          </select>

          {/* Highlights */}
          <div className="ttrip-subsection">
            <h5>Highlights</h5>
            {form.highlights.map((h, i) => (
              <div key={h.id ?? i} className="ttrip-subitem">
                <input
                  placeholder="Caption"
                  value={h.caption}
                  onChange={(e) => {
                    const arr = [...form.highlights];
                    arr[i].caption = e.target.value;
                    setForm({ ...form, highlights: arr });
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      const fd = new FormData();
                      fd.append("image", file);
                      const r = await api.post("/upload-image", fd, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                      const arr = [...form.highlights];
                      arr[i].imageUrl = r.data.url;
                      setForm({ ...form, highlights: arr });
                      showToast("Highlight image uploaded");
                    } catch {
                      showToast("Upload failed", "error");
                    }
                  }}
                />
                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    setForm({
                      ...form,
                      highlights: form.highlights.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  ×
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
            {form.includes.map((inc, i) => (
              <div key={inc.id ?? i} className="ttrip-subitem">
                <input
                  placeholder="e.g., Professional guide"
                  value={inc.label}
                  onChange={(e) => {
                    const arr = [...form.includes];
                    arr[i].label = e.target.value;
                    setForm({ ...form, includes: arr });
                  }}
                />
                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    setForm({
                      ...form,
                      includes: form.includes.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  ×
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
            {form.excludes.map((exc, i) => (
              <div key={exc.id ?? i} className="ttrip-subitem">
                <input
                  placeholder="e.g., International flights"
                  value={exc.label}
                  onChange={(e) => {
                    const arr = [...form.excludes];
                    arr[i].label = e.target.value;
                    setForm({ ...form, excludes: arr });
                  }}
                />
                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    setForm({
                      ...form,
                      excludes: form.excludes.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  ×
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

          {/* Price Details */}
          <div className="ttrip-subsection">
            <h5>Price Details</h5>
            {form.priceDetails.map((pd, i) => (
              <div key={pd.id ?? i} className="ttrip-subitem">
                <input
                  placeholder="Pax (e.g., 2 Pax)"
                  value={pd.pax}
                  onChange={(e) => {
                    const arr = [...form.priceDetails];
                    arr[i].pax = e.target.value;
                    setForm({ ...form, priceDetails: arr });
                  }}
                  style={{ flex: 1 }}
                />
                <input
                  placeholder="Price (e.g., $3,034)"
                  value={pd.price}
                  onChange={(e) => {
                    const arr = [...form.priceDetails];
                    arr[i].price = e.target.value;
                    setForm({ ...form, priceDetails: arr });
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    setForm({
                      ...form,
                      priceDetails: form.priceDetails.filter(
                        (_, idx) => idx !== i
                      ),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ttrip-add-mini"
              onClick={addPriceDetail}
            >
              + Add Price Row
            </button>
          </div>

          {/* Facts */}
          <div className="ttrip-subsection">
            <h5>Facts</h5>
            {form.facts.map((f, i) => (
              <div key={f.id ?? i} className="ttrip-subitem">
                <select
                  value={f.key}
                  onChange={(e) => {
                    const arr = [...form.facts];
                    arr[i].key = e.target.value;
                    setForm({ ...form, facts: arr });
                  }}
                >
                  <option>Accommodation</option>
                  <option>Experience</option>
                  <option>Safety</option>
                </select>
                <input
                  placeholder="Value"
                  value={f.value}
                  onChange={(e) => {
                    const arr = [...form.facts];
                    arr[i].value = e.target.value;
                    setForm({ ...form, facts: arr });
                  }}
                />
                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    setForm({
                      ...form,
                      facts: form.facts.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="ttrip-add-mini" onClick={addFact}>
              + Add Fact
            </button>
          </div>

          <button type="submit" className="ttrip-save-btn">
            {selectedTrip ? "Update Trip" : "Create Trip"}
          </button>
        </form>
      </div>

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="ttrip-modal-overlay">
          <div className="ttrip-modal">
            <p>Are you sure you want to delete this trip?</p>
            <div className="modal-actions">
              <button className="danger" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel" onClick={() => setDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailormadeTripTab;

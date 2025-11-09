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
  const originalFactIds = useRef([]);

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
    highlights: [],
    includes: [],
    facts: [],
  });

  // ==== FETCH ====
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

  // ==== TOAST ====
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==== FORM HANDLERS ====
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
  console.log("Submit payload:", form);

  // ==== CREATE/UPDATE ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let tripId = form.id;

      // 1️⃣ parent trip
      if (tripId) {
        const payload = { ...form };
        delete payload.highlights;
        delete payload.includes;
        delete payload.facts;
        await api.put(`/tailor-trip/${tripId}`, payload);
      } else {
        const res = await api.post("/tailor-trip", form);
        tripId = res.data?.data?.id;
      }

      // 2️⃣ highlights
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

      // 3️⃣ includes
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

      // 4️⃣ facts
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

  // ==== DRAWER OPEN ====
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
          highlights: d.highlights || [],
          includes: d.includes || [],
          facts: d.facts || [],
        });
        originalHighlightIds.current = (d.highlights || []).map((x) => x.id);
        originalIncludeIds.current = (d.includes || []).map((x) => x.id);
        originalFactIds.current = (d.facts || []).map((x) => x.id);
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
      highlights: [],
      includes: [],
      facts: [],
    });

  // ==== DELETE ====
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

  // ==== LOCAL OPS ====
  const addHighlight = () =>
    setForm((p) => ({
      ...p,
      highlights: [...p.highlights, { imageUrl: "", caption: "" }],
    }));
  const addInclude = () =>
    setForm((p) => ({ ...p, includes: [...p.includes, { label: "" }] }));
  const addFact = () =>
    setForm((p) => ({
      ...p,
      facts: [...p.facts, { key: "Accommodation", value: "" }],
    }));

  const filteredTrips = trips.filter((t) =>
    activeFilter === "active" ? t.isActive : !t.isActive
  );

  // ==== UI ====
  return (
    <div className="ttrip-container">
      {toast && <div className={`ttrip-toast ${toast.type}`}>{toast.msg}</div>}

      {/* HEADER */}
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
        <button className="ttrip-add-btn" onClick={() => openDrawer()}>
          + Add Trip
        </button>
      </header>

      {/* TABLE */}
      <div className="ttrip-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Season</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.slug}</td>
                <td>
                  {t.bestSeasonStart} - {t.bestSeasonEnd}
                </td>
                <td>{t.isActive ? "Active" : "Archived"}</td>
                <td>
                  <button onClick={() => openDrawer(t)}>Edit</button>
                  <button className="delete" onClick={() => confirmDelete(t)}>
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

          <label>Overview</label>
          <textarea
            name="overview"
            value={form.overview}
            onChange={handleChange}
          />

          <label>Best Season</label>
          <div className="ttrip-inline">
            <input
              name="bestSeasonStart"
              placeholder="Start"
              value={form.bestSeasonStart}
              onChange={handleChange}
            />
            <input
              name="bestSeasonEnd"
              placeholder="End"
              value={form.bestSeasonEnd}
              onChange={handleChange}
            />
          </div>

          <label>Ideal Pax</label>
          <div className="ttrip-inline">
            <input
              name="idealPaxMin"
              placeholder="Min"
              value={form.idealPaxMin}
              onChange={handleChange}
            />
            <input
              name="idealPaxMax"
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
            <h5>Includes</h5>
            {form.includes.map((inc, i) => (
              <div key={inc.id ?? i} className="ttrip-subitem">
                <input
                  placeholder="Label"
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

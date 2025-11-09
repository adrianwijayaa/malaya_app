import React, { useState, useEffect, useRef } from "react";
import api from "../../../../api/axiosConfig";
import "./JoindetripTab.css";

const JoindetripTab = () => {
  const [jtripList, setJtripList] = useState([]);
  const [activeFilter, setActiveFilter] = useState("active");
  const [jtripSelected, setJtripSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // simpan snapshot ID relasi saat mulai edit (untuk diff)
  const originalHighlightIdsRef = useRef([]);
  const originalIncludeIdsRef = useRef([]);

  const [jtripForm, setJtripForm] = useState({
    id: null,
    title: "",
    subtitle: "",
    heroImage: "",
    date: "",
    duration: "",
    location: "",
    groupSize: "",
    activityLevel: "",
    description: "",
    isActive: true,
    highlights: [], // {id?, text, imageUrl}
    includes: [], // {id?, title, description}
  });

  const fetchTrips = async () => {
    try {
      const res = await api.get("/join-trips");
      setJtripList(res.data || []);
    } catch {
      showToast("Failed to load trips", "error");
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
    setJtripForm((p) => ({
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
      setJtripForm((p) => ({ ...p, heroImage: res.data.url }));
      showToast("Image uploaded");
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ===== SUBMIT (CREATE/UPDATE + child CRUD) =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let tripId = jtripForm.id;

      // 1) Upsert parent
      if (tripId) {
        const payload = { ...jtripForm };
        delete payload.highlights;
        delete payload.includes;
        await api.put(`/join-trip/${tripId}`, payload);
      } else {
        const res = await api.post("/join-trip", jtripForm);
        tripId = res.data?.data?.id;
      }

      // 2) Upsert HIGHLIGHTS (PUT if has id, else POST)
      const currentHighlightIds = [];
      for (const h of jtripForm.highlights) {
        const body = {
          JoinTripID: tripId,
          text: h.text || "",
          imageUrl: h.imageUrl || "",
          sortOrder: h.sortOrder ?? 0,
        };
        if (h.id) {
          await api.put(`/join-trip-highlight/${h.id}`, body);
          currentHighlightIds.push(h.id);
        } else if (h.text || h.imageUrl) {
          const r = await api.post("/join-trip-highlight", body);
          if (r.data?.data?.id) currentHighlightIds.push(r.data.data.id);
        }
      }

      // 3) Delete removed HIGHLIGHTS
      if (jtripSelected?.id) {
        const toDelete = originalHighlightIdsRef.current.filter(
          (id) => !currentHighlightIds.includes(id)
        );
        await Promise.all(
          toDelete.map((id) => api.delete(`/join-trip-highlight/${id}`))
        );
      }

      // 4) Upsert INCLUDES
      const currentIncludeIds = [];
      for (const inc of jtripForm.includes) {
        const body = {
          JoinTripID: tripId,
          title: inc.title || "",
          description: inc.description || "",
          sortOrder: inc.sortOrder ?? 0,
        };
        if (inc.id) {
          await api.put(`/join-trip-include/${inc.id}`, body);
          currentIncludeIds.push(inc.id);
        } else if (inc.title || inc.description) {
          const r = await api.post("/join-trip-include", body);
          if (r.data?.data?.id) currentIncludeIds.push(r.data.data.id);
        }
      }

      // 5) Delete removed INCLUDES
      if (jtripSelected?.id) {
        const toDelete = originalIncludeIdsRef.current.filter(
          (id) => !currentIncludeIds.includes(id)
        );
        await Promise.all(
          toDelete.map((id) => api.delete(`/join-trip-include/${id}`))
        );
      }

      showToast(tripId === jtripForm.id ? "Trip updated" : "Trip created");
      fetchTrips();
      closeDrawer();
    } catch {
      showToast("Save failed", "error");
    }
  };

  const confirmDelete = (trip) => {
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/join-trip/${tripToDelete.id}`);
      fetchTrips();
      showToast("Trip deleted");
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setShowDeleteModal(false);
      setTripToDelete(null);
    }
  };

  const resetForm = () =>
    setJtripForm({
      id: null,
      title: "",
      subtitle: "",
      heroImage: "",
      date: "",
      duration: "",
      location: "",
      groupSize: "",
      activityLevel: "",
      description: "",
      isActive: true,
      highlights: [],
      includes: [],
    });

  // Open drawer; kalau edit → fetch detail + simpan snapshot ID relasi
  const openDrawer = async (trip = null) => {
    setDrawerOpen(true);
    if (trip) {
      try {
        const res = await api.get(`/join-trip/${trip.id}`);
        const d = res.data?.data;
        setJtripSelected(d);
        setJtripForm({
          id: d.id,
          title: d.title || "",
          subtitle: d.subtitle || "",
          heroImage: d.heroImage || "",
          date: d.date || "",
          duration: d.duration || "",
          location: d.location || "",
          groupSize: d.groupSize || "",
          activityLevel: d.activityLevel || "",
          description: d.description || "",
          isActive: !!d.isActive,
          highlights: (d.highlights || []).map((x) => ({
            id: x.id,
            text: x.text || "",
            imageUrl: x.imageUrl || "",
            sortOrder: x.sortOrder ?? 0,
          })),
          includes: (d.includes || []).map((x) => ({
            id: x.id,
            title: x.title || "",
            description: x.description || "",
            sortOrder: x.sortOrder ?? 0,
          })),
        });
        originalHighlightIdsRef.current = (d.highlights || []).map((x) => x.id);
        originalIncludeIdsRef.current = (d.includes || []).map((x) => x.id);
      } catch {
        showToast("Failed to load trip details", "error");
      }
    } else {
      setJtripSelected(null);
      resetForm();
      originalHighlightIdsRef.current = [];
      originalIncludeIdsRef.current = [];
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setJtripSelected(null);
      resetForm();
      originalHighlightIdsRef.current = [];
      originalIncludeIdsRef.current = [];
    }, 300);
  };

  // Local ops
  const addHighlight = () =>
    setJtripForm((p) => ({
      ...p,
      highlights: [...p.highlights, { text: "", imageUrl: "" }],
    }));

  const updateHighlight = (i, key, val) =>
    setJtripForm((p) => {
      const arr = [...p.highlights];
      arr[i] = { ...arr[i], [key]: val };
      return { ...p, highlights: arr };
    });

  const removeHighlight = (i) =>
    setJtripForm((p) => {
      const arr = [...p.highlights];
      arr.splice(i, 1);
      return { ...p, highlights: arr };
    });

  const addInclude = () =>
    setJtripForm((p) => ({
      ...p,
      includes: [...p.includes, { title: "", description: "" }],
    }));

  const updateInclude = (i, key, val) =>
    setJtripForm((p) => {
      const arr = [...p.includes];
      arr[i] = { ...arr[i], [key]: val };
      return { ...p, includes: arr };
    });

  const removeInclude = (i) =>
    setJtripForm((p) => {
      const arr = [...p.includes];
      arr.splice(i, 1);
      return { ...p, includes: arr };
    });

  const filteredTrips = jtripList.filter((t) =>
    activeFilter === "active" ? t.isActive : !t.isActive
  );

  return (
    <div className="jtrip-container">
      {toast && <div className={`jtrip-toast ${toast.type}`}>{toast.msg}</div>}

      <header className="jtrip-header">
        <div className="jtrip-header-left">
          <h3>Join De Trip Management</h3>
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
        <button className="jtrip-add-btn" onClick={() => openDrawer()}>
          + Add Trip
        </button>
      </header>

      <div className="jtrip-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.title}</td>
                <td>{trip.date}</td>
                <td>{trip.location}</td>
                <td>{trip.isActive ? "Active" : "Archived"}</td>
                <td>
                  <button onClick={() => openDrawer(trip)}>Edit</button>
                  <button
                    className="delete"
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

      {/* Drawer */}
      <div className={`jtrip-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="jtrip-drawer-header">
          <h4>{jtripSelected ? "Edit Trip" : "Add New Trip"}</h4>
          <button onClick={closeDrawer}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="jtrip-form">
          <label>Title</label>
          <input
            name="title"
            value={jtripForm.title}
            onChange={handleChange}
            required
          />

          <label>Subtitle</label>
          <input
            name="subtitle"
            value={jtripForm.subtitle}
            onChange={handleChange}
          />

          <label>Status</label>
          <div className="jtrip-status">
            <input
              type="checkbox"
              name="isActive"
              checked={jtripForm.isActive}
              onChange={handleChange}
            />
            <span>{jtripForm.isActive ? "Active" : "Archived"}</span>
          </div>

          <label>Hero Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p>Uploading...</p>}

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={jtripForm.date}
            onChange={handleChange}
            required
          />

          <label>Duration</label>
          <input
            name="duration"
            value={jtripForm.duration}
            onChange={handleChange}
            required
          />

          <label>Location</label>
          <input
            name="location"
            value={jtripForm.location}
            onChange={handleChange}
            required
          />

          <label>Group Size</label>
          <input
            name="groupSize"
            value={jtripForm.groupSize}
            onChange={handleChange}
          />

          <label>Activity Level</label>
          <input
            name="activityLevel"
            value={jtripForm.activityLevel}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={jtripForm.description}
            onChange={handleChange}
          />

          {/* Highlights */}
          <div className="jtrip-subsection">
            <h5>Highlights</h5>
            {jtripForm.highlights.map((h, i) => (
              <div key={h.id ?? i} className="jtrip-subitem-vertical">
                <label>Text</label>
                <input
                  placeholder="Highlight Text"
                  value={h.text}
                  onChange={(e) => updateHighlight(i, "text", e.target.value)}
                />

                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      const formData = new FormData();
                      formData.append("image", file);
                      const res = await api.post("/upload-image", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                      updateHighlight(i, "imageUrl", res.data.url);
                      showToast("Highlight image uploaded");
                    } catch {
                      showToast("Upload failed", "error");
                    }
                  }}
                />

                <button
                  type="button"
                  className="delete"
                  onClick={() => removeHighlight(i)}
                >
                  × Remove
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
            {jtripForm.includes.map((inc, i) => (
              <div key={inc.id ?? i} className="jtrip-subitem-vertical">
                <label>Title</label>
                <input
                  placeholder="Include Title"
                  value={inc.title}
                  onChange={(e) => updateInclude(i, "title", e.target.value)}
                />

                <label>Description</label>
                <textarea
                  placeholder="Include Description"
                  value={inc.description}
                  onChange={(e) =>
                    updateInclude(i, "description", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="delete"
                  onClick={() => removeInclude(i)}
                >
                  × Remove
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

          <button type="submit" className="jtrip-save-btn">
            {jtripSelected ? "Update Trip" : "Create Trip"}
          </button>
        </form>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="jtrip-modal-overlay">
          <div className="jtrip-modal">
            <p>Are you sure you want to delete this trip?</p>
            <div className="modal-actions">
              <button className="danger" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button
                className="cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoindetripTab;

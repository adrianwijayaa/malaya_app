import React, { useEffect, useMemo, useState } from "react";
import api from "../../../../api/axiosConfig";
import "./NewsContent.css";

export default function NewsContent() {
  const [statusFilter, setStatusFilter] = useState("active");
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [form, setForm] = useState({
    id: null,
    title: "",
    slug: "",
    desc: "",
    imageUrl: "",
    date: "",
    readTime: 5,
    featured: false,
    body: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const tokenHeader = () => {
    const token = localStorage.getItem("adminToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter === "active" || statusFilter === "archived") {
        params.set("status", statusFilter);
      }
      const res = await api.get(`/news?${params.toString()}`, tokenHeader());
      setNewsList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      if (e?.response?.status === 404) {
        setNewsList([]);
      } else {
        showToast("Failed to load news", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredNews = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const base = newsList.filter(
      (n) =>
        !q ||
        n.title?.toLowerCase().includes(q) ||
        n.slug?.toLowerCase().includes(q)
    );
    const order = sortOrder === "asc" ? 1 : -1;
    const sorted = [...base].sort((a, b) => {
      if (sortBy === "name") return order * a.title.localeCompare(b.title);
      const da = a.date ? new Date(a.date) : new Date(0);
      const db = b.date ? new Date(b.date) : new Date(0);
      return order * (da - db);
    });
    return sorted;
  }, [newsList, searchTerm, sortBy, sortOrder]);

  const openDrawer = async (row = null) => {
    setDrawerOpen(true);
    setErrors({});
    if (!row) {
      setSelectedNews(null);
      setForm({
        id: null,
        title: "",
        slug: "",
        desc: "",
        imageUrl: "",
        date: "",
        readTime: 5,
        featured: false,
        body: "",
        isActive: true,
      });
      return;
    }
    try {
      const res = await api.get(`/news/${row.id}`, tokenHeader());
      const d = res.data?.data ?? row;
      setSelectedNews(d);
      setForm({
        id: d.id,
        title: d.title || "",
        slug: d.slug || "",
        desc: d.desc || "",
        imageUrl: d.imageUrl || "",
        date: d.date || "",
        readTime: d.readTime ?? 5,
        featured: !!d.featured,
        body: d.body || "",
        isActive: d.isActive !== false,
      });
    } catch {
      const d = row;
      setSelectedNews(d);
      setForm({
        id: d.id,
        title: d.title || "",
        slug: d.slug || "",
        desc: d.desc || "",
        imageUrl: d.imageUrl || "",
        date: d.date || "",
        readTime: d.readTime ?? 5,
        featured: !!d.featured,
        body: d.body || "",
        isActive: d.isActive !== false,
      });
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedNews(null);
      setErrors({});
    }, 250);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Required";
    if (!form.slug.trim()) err.slug = "Required";
    if (!form.desc.trim()) err.desc = "Required";
    if (!form.date) err.date = "Required";
    if (!String(form.readTime).trim()) err.readTime = "Required";
    else if (!Number.isInteger(+form.readTime) || +form.readTime < 1)
      err.readTime = "Must be an integer ≥ 1";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        desc: form.desc.trim(),
        imageUrl: form.imageUrl ? form.imageUrl : null,
        date: form.date,
        readTime: +form.readTime,
        featured: !!form.featured,
        body: form.body || null,
        isActive: !!form.isActive,
      };

      if (form.id) {
        await api.put(`/news/${form.id}`, payload, tokenHeader());
        showToast("News updated");
      } else {
        await api.post("/news", payload, tokenHeader());
        showToast("News created");
      }

      await fetchNews();
      closeDrawer();
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message;
      if (status === 409 && msg?.includes("slug")) {
        setErrors((p) => ({ ...p, slug: "Slug already exists" }));
      } else if (status === 400) {
        if (/readTime/i.test(msg || "")) {
          setErrors((p) => ({ ...p, readTime: "Must be an integer ≥ 1" }));
        } else if (/imageUrl/i.test(msg || "")) {
          showToast("Image URL invalid (upload image again)", "error");
        } else {
          showToast(msg || "Invalid input", "error");
        }
      } else {
        showToast("Save failed", "error");
      }
    }
  };

  const confirmDelete = (row) => {
    setToDelete(row);
    setShowDeleteModal(true);
  };

  const doDelete = async () => {
    try {
      await api.delete(`/news/${toDelete.id}`, tokenHeader());
      showToast("News deleted");
      await fetchNews();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setShowDeleteModal(false);
      setToDelete(null);
      if (selectedNews?.id === toDelete?.id) closeDrawer();
    }
  };

  const toggleActive = async (row, nextActive) => {
    try {
      await api.put(
        `/news/${row.id}`,
        { isActive: !!nextActive },
        tokenHeader()
      );
    } catch {
      showToast("Update status failed", "error");
      return;
    }
    showToast(nextActive ? "Restored to Active" : "Archived");
    await fetchNews();
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((p) => ({ ...p, imageUrl: res.data?.url || "" }));
      showToast("Image uploaded");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="news-admin">
      {toast && <div className={`nc-toast ${toast.type}`}>{toast.msg}</div>}

      <header className="nc-header">
        <div className="nc-title">
          <h3>News Management</h3>
          <p>Create, edit, publish, and manage status.</p>
        </div>
        <button className="nc-add" onClick={() => openDrawer()}>
          + Add News
        </button>
      </header>

      <div className="nc-status-tabs">
        <button
          className={`nc-status-chip ${
            statusFilter === "active" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("active")}
          type="button"
        >
          Active
        </button>
        <button
          className={`nc-status-chip ${
            statusFilter === "archived" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("archived")}
          type="button"
        >
          Archived
        </button>
      </div>

      <div className="nc-controls">
        <input
          className="nc-search"
          placeholder="Search by title or slug…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="nc-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Title</option>
        </select>
        <button
          className="nc-order"
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
          title="Toggle sort order"
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {isLoading ? (
        <div className="nc-loading">
          <div className="nc-spinner" />
          <p>Loading news…</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="nc-empty">
          <i className="fas fa-newspaper" />
          <p>No news found</p>
        </div>
      ) : (
        <div className="nc-list">
          {filteredNews.map((n) => (
            <div className="nc-card" key={n.id}>
              <div className="nc-card-top">
                <div className="nc-card-meta">
                  <h4>{n.title}</h4>
                  <span className={`nc-badge ${n.featured ? "featured" : ""}`}>
                    {n.featured ? "Featured" : "Standard"}
                  </span>
                  <span
                    className={`nc-badge status ${
                      n.isActive ? "active" : "archived"
                    }`}
                  >
                    {n.isActive ? "Active" : "Archived"}
                  </span>
                </div>
                <div className="nc-card-sub">
                  <span className="nc-date">
                    {n.date
                      ? new Date(n.date).toLocaleDateString("en-GB")
                      : "No Date"}
                  </span>
                  <span className="nc-dot">·</span>
                  <span className="nc-read">{n.readTime} min read</span>
                  <span className="nc-dot">·</span>
                  <span className="nc-slug">{n.slug}</span>
                </div>
              </div>

              <div className="nc-actions">
                <button onClick={() => openDrawer(n)}>Edit</button>
                {n.isActive ? (
                  <button
                    className="neutral"
                    onClick={() => toggleActive(n, false)}
                    title="Archive"
                  >
                    Archive
                  </button>
                ) : (
                  <button
                    className="restore"
                    onClick={() => toggleActive(n, true)}
                    title="Restore to Active"
                  >
                    Restore
                  </button>
                )}
                <button className="danger" onClick={() => confirmDelete(n)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`nc-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="nc-drawer-head">
          <h4>{form.id ? "Edit News" : "Create News"}</h4>
          <button className="nc-close" onClick={closeDrawer}>
            ×
          </button>
        </div>

        <form className="nc-form" onSubmit={submit}>
          <label>Title {errors.title && <em>{errors.title}</em>}</label>
          <input name="title" value={form.title} onChange={onChange} />

          <label>Slug {errors.slug && <em>{errors.slug}</em>}</label>
          <input
            name="slug"
            value={form.slug}
            onChange={onChange}
            placeholder="my-awesome-article"
          />

          <label>Excerpt / Desc {errors.desc && <em>{errors.desc}</em>}</label>
          <textarea
            name="desc"
            value={form.desc}
            onChange={onChange}
            placeholder="Short summary shown in list…"
          />

          <div className="nc-row">
            <div className="nc-col">
              <label>Date {errors.date && <em>{errors.date}</em>}</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
              />
            </div>
            <div className="nc-col">
              <label>
                Read Time (min) {errors.readTime && <em>{errors.readTime}</em>}
              </label>
              <input
                name="readTime"
                value={form.readTime}
                onChange={onChange}
                inputMode="numeric"
              />
            </div>
          </div>

          <label className="nc-check">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={onChange}
            />
            <span>Featured</span>
          </label>

          <label className="nc-check">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            <span>Active (uncheck = Archive)</span>
          </label>

          {/* File-only image uploader (tanpa input URL, tanpa preview) */}
          <div className="nc-upload">
            <input
              id="nc-file"
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
            <label htmlFor="nc-file">Upload cover image</label>
            {uploading && <span className="nc-hint">Uploading…</span>}
            {!uploading && !form.imageUrl && (
              <span className="nc-hint">No image attached</span>
            )}
          </div>

          <label>Body (Markdown/plain)</label>
          <textarea
            className="nc-body"
            name="body"
            value={form.body}
            onChange={onChange}
            placeholder="Full content…"
          />

          <div className="nc-preview">
            <div className="nc-preview-head">Preview (plain)</div>
            <div className="nc-preview-body">
              {form.body ? <pre>{form.body}</pre> : <i>No content</i>}
            </div>
          </div>

          <button type="submit" className="nc-save">
            {form.id ? "Update News" : "Create News"}
          </button>
        </form>
      </div>

      {showDeleteModal && (
        <div className="nc-modal-overlay">
          <div className="nc-modal">
            <p>Delete this news?</p>
            <div className="nc-modal-actions">
              <button className="danger" onClick={doDelete}>
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
}

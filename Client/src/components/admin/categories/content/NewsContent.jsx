import React, { useEffect, useMemo, useState } from "react";
import { useLenis } from "lenis/react";
import api, { BASE_URL } from "../../../../api/axiosConfig";
import DeleteModal from "../../modals/DeleteModal";
import "./NewsContent.css";

export default function NewsContent() {
  const lenis = useLenis();

  // Helper function untuk preview image
  const imageSrc = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const base = BASE_URL?.replace(/\/+$/, "") || "";
    const path = String(url).startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  const [statusFilter, setStatusFilter] = useState("active");
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
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
    setTimeout(() => setToast(null), 3000);
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
  }, [statusFilter]);

  useEffect(() => {
    if (drawerOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [drawerOpen, lenis]);

  const filteredNews = useMemo(() => {
    return [...newsList].sort((a, b) => {
      const da = a.date ? new Date(a.date) : new Date(0);
      const db = b.date ? new Date(b.date) : new Date(0);
      return db - da;
    });
  }, [newsList]);

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
    }, 300);
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
      err.readTime = "Must be integer ≥ 1";
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
          setErrors((p) => ({ ...p, readTime: "Must be integer ≥ 1" }));
        } else {
          showToast(msg || "Invalid input", "error");
        }
      } else {
        showToast("Save failed", "error");
      }
    }
  };

  const confirmDelete = (row) => {
    setToDelete({
      ...row,
      fullname: row.title,
      email: row.slug,
      status: row.isActive ? "Active" : "Archived",
    });
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

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const token = localStorage.getItem("adminToken");
      const res = await api.post("/upload-image", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
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
    <div className="news-container">
      {toast && <div className={`news-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="news-header">
        <div className="news-header-left">
          <h3>News Management</h3>
          <div className="news-tabs">
            <button
              className={statusFilter === "active" ? "active" : ""}
              onClick={() => setStatusFilter("active")}
              type="button"
            >
              Active
            </button>
            <button
              className={statusFilter === "archived" ? "active" : ""}
              onClick={() => setStatusFilter("archived")}
              type="button"
            >
              Archived
            </button>
            <button
              className={statusFilter === "" ? "active" : ""}
              onClick={() => setStatusFilter("")}
              type="button"
            >
              All
            </button>
          </div>
        </div>
        <button className="news-btn-add" onClick={() => openDrawer()}>
          + Add News
        </button>
      </div>

      {isLoading ? (
        <div className="news-loading">
          <div className="news-spinner" />
          <p>Loading news...</p>
        </div>
      ) : (
        <div className="news-table-wrapper">
          <table className="news-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Date</th>
                <th>Read Time</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((n) => (
                <tr key={n.id}>
                  <td>{n.title}</td>
                  <td>{n.slug}</td>
                  <td>
                    {n.date
                      ? new Date(n.date).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td>{n.readTime} min</td>
                  <td>
                    <span className={`news-badge ${n.featured ? "yes" : ""}`}>
                      {n.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`news-status-badge ${
                        n.isActive ? "active" : "inactive"
                      }`}
                    >
                      {n.isActive ? "Active" : "Archived"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="news-action-btn edit"
                      onClick={() => openDrawer(n)}
                    >
                      Edit
                    </button>
                    <button
                      className="news-action-btn delete"
                      onClick={() => confirmDelete(n)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className={`news-drawer ${drawerOpen ? "open" : ""}`}
        data-lenis-prevent
      >
        <div className="news-drawer-header">
          <h4>{form.id ? "Edit News" : "Create News"}</h4>
          <button onClick={closeDrawer}>×</button>
        </div>

        <form className="news-form" onSubmit={submit}>
          <div>
            <label>
              Title *{" "}
              {errors.title && <span className="error">{errors.title}</span>}
            </label>
            <input name="title" value={form.title} onChange={onChange} />
          </div>

          <div>
            <label>
              Slug *{" "}
              {errors.slug && <span className="error">{errors.slug}</span>}
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={onChange}
              placeholder="my-awesome-article"
            />
          </div>

          <div>
            <label>
              Description *{" "}
              {errors.desc && <span className="error">{errors.desc}</span>}
            </label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={onChange}
              placeholder="Short summary..."
              rows="3"
            />
          </div>

          <div>
            <label>
              Date *{" "}
              {errors.date && <span className="error">{errors.date}</span>}
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
            />
          </div>

          <div>
            <label>
              Read Time (min) *{" "}
              {errors.readTime && (
                <span className="error">{errors.readTime}</span>
              )}
            </label>
            <input
              type="number"
              name="readTime"
              value={form.readTime}
              onChange={onChange}
              min="1"
            />
          </div>

          <div>
            <label>Cover Image {uploading && "(Uploading...)"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
            {form.imageUrl && (
              <img src={imageSrc(form.imageUrl)} alt="Preview" className="news-preview" />
            )}
          </div>

          <div className="news-status">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={onChange}
            />
            <label>Featured Article</label>
          </div>

          <div className="news-status">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            <label>Active (visible to public)</label>
          </div>

          <div>
            <label>Body Content</label>
            <textarea
              className="news-body"
              name="body"
              value={form.body}
              onChange={onChange}
              placeholder="Full article content..."
              rows="10"
            />
          </div>

          <button type="submit" className="news-submit-btn">
            {form.id ? "Update News" : "Create News"}
          </button>
        </form>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        request={toDelete}
        onConfirm={doDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

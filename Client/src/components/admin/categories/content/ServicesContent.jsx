import React, { useEffect, useMemo, useState } from "react";
import { useLenis } from "lenis/react";
import api, { BASE_URL } from "../../../../api/axiosConfig";
import DeleteModal from "../../modals/DeleteModal";
import "./ServicesContent.css";

export default function ServicesContent() {
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
  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    slug: "",
    description: "",
    price: "",
    rating: 4.5,
    reviews: 0,
    imageUrl: "",
    detailDescription: "",
    packages: [],
    valueProps: [],
    testimonials: [],
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    packages: false,
    valueProps: false,
    testimonials: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tokenHeader = () => {
    const token = localStorage.getItem("adminToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter === "active" || statusFilter === "archived") {
        params.set("status", statusFilter);
      }
      const res = await api.get(
        `/services?${params.toString()}`,
        tokenHeader()
      );
      setServicesList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      if (e?.response?.status === 404) {
        setServicesList([]);
      } else {
        showToast("Failed to load services", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  useEffect(() => {
    if (drawerOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [drawerOpen, lenis]);

  const filteredServices = useMemo(() => {
    return [...servicesList].sort((a, b) => a.name.localeCompare(b.name));
  }, [servicesList]);

  const openDrawer = async (row = null) => {
    setDrawerOpen(true);
    setErrors({});
    if (!row) {
      setSelectedService(null);
      setForm({
        id: null,
        name: "",
        slug: "",
        description: "",
        price: "",
        rating: 4.5,
        reviews: 0,
        imageUrl: "",
        detailDescription: "",
        packages: [],
        valueProps: [],
        testimonials: [],
        isActive: true,
      });
      return;
    }
    try {
      const res = await api.get(`/services/${row.id}`, tokenHeader());
      const d = res.data?.data ?? row;
      setSelectedService(d);
      setForm({
        id: d.id,
        name: d.name || "",
        slug: d.slug || "",
        description: d.description || "",
        price: d.price || "",
        rating: d.rating ?? 4.5,
        reviews: d.reviews ?? 0,
        imageUrl: d.imageUrl || "",
        detailDescription: d.detailDescription || "",
        packages: d.packages || [],
        valueProps: d.valueProps || [],
        testimonials: d.testimonials || [],
        isActive: d.isActive !== false,
      });
    } catch {
      const d = row;
      setSelectedService(d);
      setForm({
        id: d.id,
        name: d.name || "",
        slug: d.slug || "",
        description: d.description || "",
        price: d.price || "",
        rating: d.rating ?? 4.5,
        reviews: d.reviews ?? 0,
        imageUrl: d.imageUrl || "",
        detailDescription: d.detailDescription || "",
        packages: d.packages || [],
        valueProps: d.valueProps || [],
        testimonials: d.testimonials || [],
        isActive: d.isActive !== false,
      });
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedService(null);
      setErrors({});
    }, 300);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Required";
    if (!form.slug.trim()) err.slug = "Required";
    if (!form.description.trim()) err.description = "Required";
    if (!form.price.trim()) err.price = "Required";
    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      err.rating = "Must be between 0 and 5";
    }
    if (!Number.isInteger(+form.reviews) || +form.reviews < 0) {
      err.reviews = "Must be integer ≥ 0";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        rating: parseFloat(form.rating),
        reviews: +form.reviews,
        imageUrl: form.imageUrl ? form.imageUrl : null,
        detailDescription: form.detailDescription || null,
        packages: form.packages || [],
        valueProps: form.valueProps || [],
        testimonials: form.testimonials || [],
        isActive: !!form.isActive,
      };

      if (form.id) {
        await api.put(`/services/${form.id}`, payload, tokenHeader());
        showToast("Service updated");
      } else {
        await api.post("/services", payload, tokenHeader());
        showToast("Service created");
      }

      await fetchServices();
      closeDrawer();
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message;
      if (status === 409 && msg?.includes("slug")) {
        setErrors((p) => ({ ...p, slug: "Slug already exists" }));
      } else if (status === 400) {
        showToast(msg || "Invalid input", "error");
      } else {
        showToast("Save failed", "error");
      }
    }
  };

  const confirmDelete = (row) => {
    setToDelete({
      ...row,
      fullname: row.name,
      email: row.slug,
      status: row.isActive ? "Active" : "Archived",
    });
    setShowDeleteModal(true);
  };

  const doDelete = async () => {
    try {
      await api.delete(`/services/${toDelete.id}`, tokenHeader());
      showToast("Service deleted");
      await fetchServices();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setShowDeleteModal(false);
      setToDelete(null);
      if (selectedService?.id === toDelete?.id) closeDrawer();
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

  // ========================================
  // PACKAGES MANAGEMENT
  // ========================================
  const addPackage = () => {
    setForm((p) => ({
      ...p,
      packages: [
        ...p.packages,
        {
          id: Date.now(),
          name: "",
          price: "",
          duration: "",
          description: "",
          imageUrl: "",
          features: [],
        },
      ],
    }));
  };

  const updatePackage = (idx, field, value) => {
    setForm((p) => {
      const updated = [...p.packages];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...p, packages: updated };
    });
  };

  const uploadPackageImage = async (pkgIdx, file) => {
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
      updatePackage(pkgIdx, "imageUrl", res.data?.url || "");
      showToast("Package image uploaded");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const deletePackage = (idx) => {
    setForm((p) => ({
      ...p,
      packages: p.packages.filter((_, i) => i !== idx),
    }));
  };

  const addPackageFeature = (pkgIdx) => {
    setForm((p) => {
      const updated = [...p.packages];
      updated[pkgIdx].features = [...(updated[pkgIdx].features || []), ""];
      return { ...p, packages: updated };
    });
  };

  const updatePackageFeature = (pkgIdx, featIdx, value) => {
    setForm((p) => {
      const updated = [...p.packages];
      updated[pkgIdx].features[featIdx] = value;
      return { ...p, packages: updated };
    });
  };

  const deletePackageFeature = (pkgIdx, featIdx) => {
    setForm((p) => {
      const updated = [...p.packages];
      updated[pkgIdx].features = updated[pkgIdx].features.filter(
        (_, i) => i !== featIdx
      );
      return { ...p, packages: updated };
    });
  };

  // ========================================
  // VALUE PROPS MANAGEMENT
  // ========================================
  const addValueProp = () => {
    setForm((p) => ({
      ...p,
      valueProps: [
        ...p.valueProps,
        { icon: "", title: "", desc: "", imageUrl: "" },
      ],
    }));
  };

  const updateValueProp = (idx, field, value) => {
    setForm((p) => {
      const updated = [...p.valueProps];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...p, valueProps: updated };
    });
  };

  const deleteValueProp = (idx) => {
    setForm((p) => ({
      ...p,
      valueProps: p.valueProps.filter((_, i) => i !== idx),
    }));
  };

  const uploadValuePropImage = async (vpIdx, file) => {
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
      updateValueProp(vpIdx, "imageUrl", res.data?.url || "");
      showToast("Value prop image uploaded");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ========================================
  // TESTIMONIALS MANAGEMENT
  // ========================================
  const addTestimonial = () => {
    setForm((p) => ({
      ...p,
      testimonials: [
        ...p.testimonials,
        { id: Date.now(), name: "", rating: 5, text: "" },
      ],
    }));
  };

  const updateTestimonial = (idx, field, value) => {
    setForm((p) => {
      const updated = [...p.testimonials];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...p, testimonials: updated };
    });
  };

  const deleteTestimonial = (idx) => {
    setForm((p) => ({
      ...p,
      testimonials: p.testimonials.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="services-container">
      {toast && (
        <div className={`services-toast ${toast.type}`}>{toast.msg}</div>
      )}

      <div className="services-header">
        <div className="services-header-left">
          <h3>Services Management</h3>
          <div className="services-tabs">
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
        <button className="services-btn-add" onClick={() => openDrawer()}>
          + Add Service
        </button>
      </div>

      {isLoading ? (
        <div className="services-loading">
          <div className="services-spinner" />
          <p>Loading services...</p>
        </div>
      ) : (
        <div className="services-table-wrapper">
          <table className="services-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No services found
                  </td>
                </tr>
              ) : (
                filteredServices.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.slug}</td>
                    <td>{row.price}</td>
                    <td>
                      <span className="services-rating">
                        ★ {parseFloat(row.rating).toFixed(1)}
                      </span>
                    </td>
                    <td>{row.reviews}</td>
                    <td>
                      <span
                        className={`services-status ${
                          row.isActive ? "active" : "archived"
                        }`}
                      >
                        {row.isActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="services-btn-edit"
                        onClick={() => openDrawer(row)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="services-btn-delete"
                        onClick={() => confirmDelete(row)}
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div
        className={`services-drawer ${drawerOpen ? "open" : ""}`}
        data-lenis-prevent
      >
        <div className="services-drawer-header">
          <h2>{form.id ? "Edit Service" : "Add Service"}</h2>
          <button
            className="services-drawer-close"
            onClick={closeDrawer}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="services-form">
          <div className="services-form-group">
            <label>
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g. Diving"
            />
            {errors.name && (
              <span className="services-error">{errors.name}</span>
            )}
          </div>

          <div className="services-form-group">
            <label>
              Slug <span className="required">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={onChange}
              placeholder="e.g. diving"
            />
            {errors.slug && (
              <span className="services-error">{errors.slug}</span>
            )}
          </div>

          <div className="services-form-group">
            <label>
              Description <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Short description for listing page"
              rows="3"
            />
            {errors.description && (
              <span className="services-error">{errors.description}</span>
            )}
          </div>

          <div className="services-form-group">
            <label>
              Price <span className="required">*</span>
            </label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={onChange}
              placeholder="e.g. From $50"
            />
            {errors.price && (
              <span className="services-error">{errors.price}</span>
            )}
          </div>

          <div className="services-form-row">
            <div className="services-form-group">
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={onChange}
                step="0.1"
                min="0"
                max="5"
              />
              {errors.rating && (
                <span className="services-error">{errors.rating}</span>
              )}
            </div>

            <div className="services-form-group">
              <label>Reviews</label>
              <input
                type="number"
                name="reviews"
                value={form.reviews}
                onChange={onChange}
                min="0"
              />
              {errors.reviews && (
                <span className="services-error">{errors.reviews}</span>
              )}
            </div>
          </div>

          <div className="services-form-group">
            <label>Image URL</label>
            <div className="services-upload-group">
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={onChange}
                placeholder="/uploads/... or https://..."
              />
              <label className="services-upload-btn">
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          <div className="services-form-group">
            <label>Detail Description</label>
            <textarea
              name="detailDescription"
              value={form.detailDescription}
              onChange={onChange}
              placeholder="Long description for detail page"
              rows="5"
            />
          </div>

          {/* PACKAGES SECTION */}
          <div className="services-nested-section">
            <div
              className="services-nested-header"
              onClick={() => toggleSection("packages")}
            >
              <h4>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Packages ({form.packages.length})
              </h4>
              <svg
                className={`services-chevron ${
                  expandedSections.packages ? "open" : ""
                }`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {expandedSections.packages && (
              <div className="services-nested-content">
                {form.packages.map((pkg, pkgIdx) => (
                  <div key={pkg.id || pkgIdx} className="services-nested-item">
                    <div className="services-nested-item-header">
                      <span>Package #{pkgIdx + 1}</span>
                      <button
                        type="button"
                        className="services-btn-delete-nested"
                        onClick={() => deletePackage(pkgIdx)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="services-nested-grid">
                      <div className="services-form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) =>
                            updatePackage(pkgIdx, "name", e.target.value)
                          }
                          placeholder="e.g. Discover Scuba"
                        />
                      </div>

                      <div className="services-form-group">
                        <label>Price *</label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) =>
                            updatePackage(pkgIdx, "price", e.target.value)
                          }
                          placeholder="e.g. IDR 1,250,000"
                        />
                      </div>

                      <div className="services-form-group">
                        <label>Duration *</label>
                        <input
                          type="text"
                          value={pkg.duration}
                          onChange={(e) =>
                            updatePackage(pkgIdx, "duration", e.target.value)
                          }
                          placeholder="e.g. 1 Day"
                        />
                      </div>
                    </div>

                    <div className="services-form-group">
                      <label>Description</label>
                      <textarea
                        value={pkg.description}
                        onChange={(e) =>
                          updatePackage(pkgIdx, "description", e.target.value)
                        }
                        placeholder="Package description"
                        rows="2"
                      />
                    </div>

                    <div className="services-form-group">
                      <label>Package Image</label>
                      <div className="services-upload-group">
                        <input
                          type="text"
                          value={pkg.imageUrl || ""}
                          onChange={(e) =>
                            updatePackage(pkgIdx, "imageUrl", e.target.value)
                          }
                          placeholder="/uploads/... or https://..."
                        />
                        <label className="services-upload-btn">
                          {uploading ? "..." : "Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              uploadPackageImage(pkgIdx, e.target.files?.[0])
                            }
                            disabled={uploading}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                      {pkg.imageUrl && (
                        <div className="services-image-preview">
                          <img
                            src={imageSrc(pkg.imageUrl)}
                            alt="Preview"
                          />
                        </div>
                      )}
                    </div>

                    <div className="services-form-group">
                      <label>Features</label>
                      {pkg.features?.map((feat, featIdx) => (
                        <div key={featIdx} className="services-feature-row">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) =>
                              updatePackageFeature(
                                pkgIdx,
                                featIdx,
                                e.target.value
                              )
                            }
                            placeholder="Feature description"
                          />
                          <button
                            type="button"
                            className="services-btn-remove-feature"
                            onClick={() =>
                              deletePackageFeature(pkgIdx, featIdx)
                            }
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="services-btn-add-feature"
                        onClick={() => addPackageFeature(pkgIdx)}
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="services-btn-add-nested"
                  onClick={addPackage}
                >
                  + Add Package
                </button>
              </div>
            )}
          </div>

          {/* VALUE PROPS SECTION */}
          <div className="services-nested-section">
            <div
              className="services-nested-header"
              onClick={() => toggleSection("valueProps")}
            >
              <h4>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Value Propositions ({form.valueProps.length})
              </h4>
              <svg
                className={`services-chevron ${
                  expandedSections.valueProps ? "open" : ""
                }`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {expandedSections.valueProps && (
              <div className="services-nested-content">
                {form.valueProps.map((prop, idx) => (
                  <div key={idx} className="services-nested-item">
                    <div className="services-nested-item-header">
                      <span>Value Prop #{idx + 1}</span>
                      <button
                        type="button"
                        className="services-btn-delete-nested"
                        onClick={() => deleteValueProp(idx)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="services-nested-grid">
                      <div className="services-form-group">
                        <label>Icon</label>
                        <input
                          type="text"
                          value={prop.icon}
                          onChange={(e) =>
                            updateValueProp(idx, "icon", e.target.value)
                          }
                          placeholder="e.g. 🏆 or emoji"
                        />
                      </div>

                      <div className="services-form-group">
                        <label>Title *</label>
                        <input
                          type="text"
                          value={prop.title}
                          onChange={(e) =>
                            updateValueProp(idx, "title", e.target.value)
                          }
                          placeholder="e.g. Award Winning"
                        />
                      </div>

                      <div className="services-form-group">
                        <label>Description *</label>
                        <input
                          type="text"
                          value={prop.desc}
                          onChange={(e) =>
                            updateValueProp(idx, "desc", e.target.value)
                          }
                          placeholder="e.g. 5 years excellence"
                        />
                      </div>
                    </div>

                    <div className="services-form-group">
                      <label>Value Prop Image</label>
                      <div className="services-upload-group">
                        <input
                          type="text"
                          value={prop.imageUrl || ""}
                          onChange={(e) =>
                            updateValueProp(idx, "imageUrl", e.target.value)
                          }
                          placeholder="/uploads/... or https://..."
                        />
                        <label className="services-upload-btn">
                          {uploading ? "..." : "Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              uploadValuePropImage(idx, e.target.files?.[0])
                            }
                            disabled={uploading}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                      {prop.imageUrl && (
                        <div className="services-image-preview">
                          <img
                            src={imageSrc(prop.imageUrl)}
                            alt="Preview"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="services-btn-add-nested"
                  onClick={addValueProp}
                >
                  + Add Value Proposition
                </button>
              </div>
            )}
          </div>

          {/* TESTIMONIALS SECTION */}
          <div className="services-nested-section">
            <div
              className="services-nested-header"
              onClick={() => toggleSection("testimonials")}
            >
              <h4>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                Testimonials ({form.testimonials.length})
              </h4>
              <svg
                className={`services-chevron ${
                  expandedSections.testimonials ? "open" : ""
                }`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {expandedSections.testimonials && (
              <div className="services-nested-content">
                {form.testimonials.map((test, idx) => (
                  <div key={test.id || idx} className="services-nested-item">
                    <div className="services-nested-item-header">
                      <span>Testimonial #{idx + 1}</span>
                      <button
                        type="button"
                        className="services-btn-delete-nested"
                        onClick={() => deleteTestimonial(idx)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="services-nested-grid">
                      <div className="services-form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) =>
                            updateTestimonial(idx, "name", e.target.value)
                          }
                          placeholder="e.g. Sarah Mitchell"
                        />
                      </div>

                      <div className="services-form-group">
                        <label>Rating *</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={test.rating}
                          onChange={(e) =>
                            updateTestimonial(
                              idx,
                              "rating",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="services-form-group">
                      <label>Testimonial Text *</label>
                      <textarea
                        value={test.text}
                        onChange={(e) =>
                          updateTestimonial(idx, "text", e.target.value)
                        }
                        placeholder="Customer testimonial..."
                        rows="3"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="services-btn-add-nested"
                  onClick={addTestimonial}
                >
                  + Add Testimonial
                </button>
              </div>
            )}
          </div>

          <div className="services-form-group">
            <label className="services-checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
              />
              <span>Active</span>
            </label>
          </div>

          <div className="services-form-actions">
            <button
              type="button"
              onClick={closeDrawer}
              className="services-btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="services-btn-save">
              {form.id ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <DeleteModal
          data={toDelete}
          onConfirm={doDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setToDelete(null);
          }}
        />
      )}
    </div>
  );
}

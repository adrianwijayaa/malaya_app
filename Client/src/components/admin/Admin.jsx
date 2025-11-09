import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

import DeleteModal from "./modals/DeleteModal";
import LogoutModal from "./modals/LogoutModal";

import OverviewTab from "./categories/bookingRequest/OverviewTab";
import TravelDetailsTab from "./categories/bookingRequest/TravelDetailsTab";
import AccommodationTab from "./categories/bookingRequest/AccommodationTab";
import ExtrasTab from "./categories/bookingRequest/ExtrasTab";
import ContentTab from "./categories/content/ContentTab";

import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("booking"); // 🔹 Tambah kategori tab
  const [bookingRequests, setBookingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toDeleteRequest, setToDeleteRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==== FETCH DATA ====
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/auth");
        return;
      }

      const [
        personalRes,
        travelRes,
        accRes,
        transportRes,
        mealRes,
        specialRes,
        activityRes,
        submissionRes,
      ] = await Promise.all([
        api.get("/personal-infos", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/travel-details", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/accommodation-prefferences", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/transportation-prefferences", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/meal-prefferences", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/special-requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/activity-interests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/submissions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const personalData = personalRes.data || [];
      const travelData = travelRes.data || [];
      const accommodationData = accRes.data || [];
      const transportationData = transportRes.data || [];
      const mealData = mealRes.data || [];
      const specialData = specialRes.data || [];
      const activityData = activityRes.data || [];
      const submissionData = submissionRes.data || [];

      const mergedData = personalData.map((person) => {
        const travel = travelData.find((t) =>
          Array.isArray(t.PersonalID)
            ? t.PersonalID.some((p) => p.id === person.id)
            : t.PersonalID === person.id
        );

        const acc = accommodationData.find(
          (a) => a.TravelDetailsID?.PersonalID === person.id
        );

        const transport = transportationData.find((tr) =>
          Array.isArray(tr.TravelDetailsID)
            ? tr.TravelDetailsID.some((t) => t.PersonalID === person.id)
            : tr.TravelDetailsID?.PersonalID === person.id
        );

        const meal = mealData.find((m) =>
          Array.isArray(m.TravelDetailsID)
            ? m.TravelDetailsID.some((t) => t.PersonalID === person.id)
            : m.TravelDetailsID?.PersonalID === person.id
        );

        const special = specialData.find((s) =>
          Array.isArray(s.TravelDetailsID)
            ? s.TravelDetailsID.some((t) => t.PersonalID === person.id)
            : s.TravelDetailsID?.PersonalID === person.id
        );

        const activity = activityData.find((a) =>
          Array.isArray(a.TravelDetailsID)
            ? a.TravelDetailsID.some((t) => t.PersonalID === person.id)
            : a.TravelDetailsID?.PersonalID === person.id
        );

        const submission = submissionData.find((sub) =>
          Array.isArray(sub.TravelDetailsID)
            ? sub.TravelDetailsID.some((t) => t.PersonalID === person.id)
            : sub.TravelDetailsID?.PersonalID === person.id
        );

        // 🔹 travelId fallback dari semua kemungkinan relasi
        const travelId =
          travel?.id ||
          acc?.TravelDetailsID?.id ||
          transport?.TravelDetailsID?.[0]?.id ||
          meal?.TravelDetailsID?.[0]?.id ||
          special?.TravelDetailsID?.[0]?.id || // ✅ ini penting
          activity?.TravelDetailsID?.[0]?.id ||
          submission?.TravelDetailsID?.[0]?.id ||
          null;

        return {
          ...person,
          travelId,
          accommodationId: acc?.AccommodationID || null,
          preferredStartDate:
            travel?.PreferredStartDate ||
            special?.TravelDetailsID?.[0]?.PreferredStartDate ||
            null,
        };
      });

      setBookingRequests(mergedData);
      console.log(
        "%c========= MERGED RELATION CHECK =========",
        "color: #4caf50; font-weight: bold; font-size: 14px;"
      );

      mergedData.forEach((item, index) => {
        console.groupCollapsed(
          `%c#${index + 1} PersonalID: ${item.id} | TravelID: ${
            item.travelId || "-"
          } | AccommodationID: ${item.accommodationId || "-"}`,
          "color:#03a9f4; font-weight:bold;"
        );

        console.log("%cFull Name:", "color:#9c27b0", item.fullname);
        console.log("%cEmail:", "color:#9c27b0", item.email);
        console.log("%cStatus:", "color:#9c27b0", item.status);
        console.log(
          "%cPreferred Start Date:",
          "color:#9c27b0",
          item.preferredStartDate || "-"
        );

        // Cek sumber data relasi extras
        console.log(
          "%c--- Relation References ---",
          "color:#ff9800; font-weight:bold;"
        );
        console.log("AccommodationID:", item.accommodationId || "-");
        console.log("TravelID:", item.travelId || "-");

        // Detail fallback dari setiap relasi
        console.log(
          "%c--- Extras Fallback Debug ---",
          "color:#ff5722; font-weight:bold;"
        );
        console.log("From Travel Data:", item.fromTravel || "-");
        console.log("From Accommodation Data:", item.fromAccommodation || "-");
        console.log(
          "From Transportation Data:",
          item.fromTransportation || "-"
        );
        console.log("From Meal Data:", item.fromMeal || "-");
        console.log("From Special Request Data:", item.fromSpecial || "-");
        console.log("From Activity Data:", item.fromActivity || "-");
        console.log("From Submission Data:", item.fromSubmission || "-");

        console.groupEnd();
      });

      console.log(
        "%c========= END OF RELATION CHECK =========",
        "color: #4caf50; font-weight: bold; font-size: 14px;"
      );
    } catch (err) {
      console.error("Error fetching booking requests:", err);
      setError("Failed to load booking requests. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `/personal-info/${requestId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookingRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDataUpdate = async (updatedData = null) => {
    await fetchRequests();
    if (updatedData && updatedData.id) {
      setSelectedRequest((prev) => ({ ...prev, ...updatedData }));
      return;
    }
    const updated = bookingRequests.find(
      (req) => req.id === selectedRequest?.id
    );
    if (updated) setSelectedRequest(updated);
  };

  const handleDeleteConfirm = async () => {
    if (!toDeleteRequest) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/personal-info/${toDeleteRequest.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookingRequests((prev) =>
        prev.filter((req) => req.id !== toDeleteRequest.id)
      );

      if (selectedRequest?.id === toDeleteRequest.id) {
        setSelectedRequest(null);
      }

      setShowDeleteModal(false);
      setToDeleteRequest(null);
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  // ==== FILTER & SORT ====
  const filteredRequests = React.useMemo(() => {
    if (!bookingRequests.length) return [];

    const filtered = bookingRequests.filter((req) => {
      const matchesStatus =
        filterStatus === "all" || req.status === filterStatus;
      const matchesSearch =
        req.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "date") {
        const dateA = a.preferredStartDate
          ? new Date(a.preferredStartDate)
          : new Date(0);
        const dateB = b.preferredStartDate
          ? new Date(b.preferredStartDate)
          : new Date(0);
        return order * (dateA - dateB);
      }
      if (sortBy === "name")
        return order * a.fullname.localeCompare(b.fullname);
      return 0;
    });

    return sorted;
  }, [bookingRequests, filterStatus, searchTerm, sortBy, sortOrder]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAuth");
    navigate("/admin/auth");
  };

  // ==== RENDER ====
  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-user-shield"></i> Admin Dashboard
          </h1>
          <button
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>

        {/* 🔹 Category Switch */}
        <div className="category-switch">
          <button
            className={`category-btn ${
              activeCategory === "booking" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("booking")}
          >
            Booking Requests
          </button>
          <button
            className={`category-btn ${
              activeCategory === "content" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("content")}
          >
            Content Management
          </button>
        </div>

        {activeCategory === "booking" && (
          <div className="admin-controls">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() =>
                setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
              }
              className="sort-order-btn"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        )}
      </header>

      {/* ==== CATEGORY VIEWS ==== */}
      {activeCategory === "booking" ? (
        isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading booking requests...</p>
          </div>
        ) : (
          <div className="admin-content">
            <div className="requests-list">
              {filteredRequests.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <p>No booking requests found</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`request-card ${
                      selectedRequest?.id === request.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="request-header">
                      <h3>{request.fullname}</h3>
                      <span className={`status-badge ${request.status}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="email-text">{request.email}</p>
                    <p className="date-status">
                      {request.preferredStartDate
                        ? new Date(
                            request.preferredStartDate
                          ).toLocaleDateString("en-GB")
                        : "No Date"}{" "}
                      | {request.status}
                    </p>
                    <div className="card-menu">
                      <button
                        className="menu-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToDeleteRequest(request);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedRequest && (
              <div className="request-detail-panel">
                <div className="detail-tabs">
                  <button
                    className={`tab-btn ${
                      activeTab === "overview" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "travel" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("travel")}
                  >
                    Travel
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "accommodation" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("accommodation")}
                  >
                    Accommodation
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "extras" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("extras")}
                  >
                    Extras
                  </button>
                </div>

                <div className="detail-content">
                  {activeTab === "overview" && (
                    <OverviewTab
                      selectedRequest={selectedRequest}
                      onDataUpdate={handleDataUpdate}
                    />
                  )}
                  {activeTab === "travel" && (
                    <TravelDetailsTab
                      selectedRequest={{
                        ...selectedRequest,
                        id: selectedRequest.travelId, // ✅ pakai travel ID
                      }}
                      onDataUpdate={handleDataUpdate}
                    />
                  )}
                  {activeTab === "accommodation" && (
                    <AccommodationTab
                      selectedRequest={{
                        ...selectedRequest,
                        id: selectedRequest.accommodationId, // ✅ pakai accommodation ID
                      }}
                      onDataUpdate={handleDataUpdate}
                    />
                  )}
                  {activeTab === "extras" && (
                    <ExtrasTab
                      selectedRequest={{
                        ...selectedRequest,
                        id: selectedRequest.travelId, // ✅ travel ID terbaru
                        personalId: selectedRequest.id, // ✅ ini penting
                      }}
                      onDataUpdate={handleDataUpdate}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <ContentTab />
      )}

      {/* ==== MODALS ==== */}
      <DeleteModal
        isOpen={showDeleteModal}
        request={toDeleteRequest}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default Admin;

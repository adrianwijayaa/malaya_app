import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import LogoutModal from "./LogoutModal";
import EditableField from "./EditableField";
import "./Admin.css";

const accommodationTypes = [
  { value: "Luxury Resort", label: "Luxury Resort" },
  { value: "Boutique Hotel", label: "Boutique Hotel" },
  { value: "Private Villa", label: "Private Villa" },
  { value: "Guest House", label: "Guest House" },
  { value: "Eco Lodge", label: "Eco Lodge" },
  { value: "Glamping", label: "Glamping" },
  { value: "Traditional Stay", label: "Traditional Stay" },
  // ...add more options
];

const roomTypes = [
  { value: "Standard Room", label: "Standard Room" },
  { value: "Deluxe Room", label: "Deluxe Room" },
  { value: "Suite", label: "Suite" },
  { value: "Family Room", label: "Family Room" },
  { value: "Pool Villa", label: "Pool Villa" },
  { value: "Ocean View Room", label: "Ocean View Room" },
  { value: "Garden View Room", label: "Garden View Room" },
  { value: "Connecting Room", label: "Connecting Room" },
  // ...add more options
];

const activityLevels = [
  {
    value: "Relaxed (Minimal physical activity)",
    label: "Relaxed (Minimal physical activity)",
  },
  {
    value: "Moderate (Some Walking, Light Activities)",
    label: "Moderate (Some Walking, Light Activities)",
  },
  {
    value: "Active (Regular activities, longer walks)",
    label: "Active (Regular activities, longer walks)",
  },
  {
    value: "Challenging (Strenuous activities, hiking)",
    label: "Challenging (Strenuous activities, hiking)",
  },
  {
    value: "Mixed (Combination of activity levels)",
    label: "Mixed (Combination of activity levels)",
  },
  // ...add more options
];

const Admin = () => {
  const navigate = useNavigate();
  const [bookingRequests, setBookingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRequest, setEditedRequest] = useState(null);
  const [toDeleteRequest, setToDeleteRequest] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/admin/auth");
          return;
        }

        // First fetch personal info
        const personalInfoRes = await fetch(
          "https://demalayaapp-production.up.railway.app/api/v1/personal-infos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!personalInfoRes.ok) {
          throw new Error("Failed to fetch booking requests");
        }

        const personalInfos = await personalInfoRes.json();
        console.log("Personal infos:", personalInfos);

        // Empty data is OK - just set empty array
        if (!personalInfos || personalInfos.length === 0) {
          setBookingRequests([]);
          setIsLoading(false);
          return;
        }

        // For each personal info, first get their travel details
        const fullRequests = await Promise.all(
          personalInfos.map(async (personalInfo) => {
            try {
              // Get travel details for this personal info
              const travelDetailsRes = await fetch(
                `https://demalayaapp-production.up.railway.app/api/v1/travel-detail/${personalInfo.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!travelDetailsRes.ok) {
                console.error(
                  `No travel details found for personal info ${personalInfo.id}`
                );
                return null;
              }

              const travelDetails = await travelDetailsRes.json();

              console.log("Travel details:", travelDetails);

              // Then use travel details ID to fetch all related info
              const [
                accommodation,
                activities,
                transportation,
                mealPreference,
                specialRequest,
                budget,
              ] = await Promise.all([
                fetch(
                  `https://demalayaapp-production.up.railway.app/api/v1/accommodation-prefference/${travelDetails.data.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ).then((res) => res.json()),
                fetch(
                  `https://demalayaapp-production.up.railway.app/api/v1/activity-interest/${travelDetails.data.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ).then((res) => res.json()),
                fetch(
                  `https://demalayaapp-production.up.railway.app/api/v1/transportation-prefference/${travelDetails.data.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ).then((res) => res.json()),
                fetch(
                  `https://demalayaapp-production.up.railway.app/api/v1/meal-prefference/${travelDetails.data.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ).then((res) => res.json()),
                fetch(
                  `https://demalayaapp-production.up.railway.app/api/v1/special-request/${travelDetails.data.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ).then((res) => res.json()),
                fetch(
                  `https://demalayaapp-production.up.railway.app/api/v1/budget/${travelDetails.data.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ).then((res) => res.json()),
              ]);

              console.log("Accommodation:", accommodation);
              console.log("Activities:", activities);
              console.log("Transportation:", transportation);
              console.log("Meal Preference:", mealPreference);
              console.log("Special Request:", specialRequest);
              console.log("Budget:", budget);

              // Combine all data into one request object (remove duplicates)
              return {
                id: personalInfo.id,
                travelDetailId: travelDetails.data.id,
                date: personalInfo.createdAt,
                fullName: personalInfo.fullname,
                email: personalInfo.email,
                phone: personalInfo.phonenumber,
                status: personalInfo.status || "pending",
                data: {
                  Currency: budget.data.Currency,
                  EstimatedBudgetPerPerson:
                    budget.data.EstimatedBudgetPerPerson,
                  TravelDetailsID: travelDetails.data
                    ? [travelDetails.data]
                    : [],
                  AccommodationID: accommodation.data
                    ? [accommodation.data]
                    : [],
                  ActivityID: activities.data ? [activities.data] : [],
                  TransportationID: transportation.data
                    ? [transportation.data]
                    : [],
                  MealPreferenceID: mealPreference.data
                    ? [mealPreference.data]
                    : [],
                  SpecialRequestID: specialRequest.data
                    ? [specialRequest.data]
                    : [],
                },
              };
            } catch (error) {
              console.error(
                `Error fetching details for request ${personalInfo.id}:`,
                error
              );
              return null;
            }
          })
        );

        // Filter out any failed requests
        const validRequests = fullRequests.filter(
          (request) => request !== null
        );
        setBookingRequests(validRequests);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching booking requests:", err);
        // Only set error for actual fetch failures
        if (err.message !== "No data found") {
          setError("Failed to load booking requests. Please try again later.");
        }
        setBookingRequests([]); // Set empty array for no data
        setIsLoading(false);
      }
    };

    fetchBookingRequests();
  }, [navigate]);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/personal-info/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setBookingRequests((requests) =>
        requests.map((request) =>
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      // Add error feedback to user
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "email":
        window.location.href = `mailto:${selectedRequest.email}`;
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/${selectedRequest.phone?.replace(/[^0-9]/g, "")}`
        );
        break;
      case "print":
        window.print();
        break;
      default:
        break;
    }
  };

  const handlePrint = () => {
    const allTabs = document.querySelectorAll("[data-tab]");
    const originalDisplays = Array.from(allTabs).map(
      (tab) => tab.style.display
    );

    allTabs.forEach((tab) => {
      tab.style.display = "block";
    });

    window.print();

    allTabs.forEach((tab, index) => {
      tab.style.display = originalDisplays[index];
    });
  };

  const handleCardClick = (request, e) => {
    // Prevent card selection when clicking menu
    if (e.target.closest(".card-menu")) {
      e.stopPropagation();
      return;
    }
    setSelectedRequest(request);
  };

  console.log("selectedRequest:", selectedRequest);

  // Add useEffect for click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest(".card-menu")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  // Modify toggleMenu to not close when clicking inside
  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleEdit = (request, e) => {
    e.stopPropagation();
    setEditFormData(request);
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleDelete = (request, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete clicked for:", request.fullname);
    setToDeleteRequest(request);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!toDeleteRequest) return;

    try {
      const token = localStorage.getItem("adminToken");

      // First delete all child records using travel detail ID
      const childEndpoints = [
        "accommodation-prefference",
        "activity-interest",
        "transportation-prefference",
        "meal-prefference",
        "special-request",
        "budget",
      ];

      // Delete all child records
      await Promise.all(
        childEndpoints.map((endpoint) =>
          fetch(
            `https://demalayaapp-production.up.railway.app/api/v1/${endpoint}/${toDeleteRequest.travelDetailId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      // Delete travel detail
      await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/travel-detail/${toDeleteRequest.travelDetailId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Finally delete personal info
      await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/personal-info/${toDeleteRequest.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      // Add error feedback to user
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setToDeleteRequest(null);
  };

  const handleEditStart = (request, e) => {
    e.stopPropagation();
    console.log("Starting edit for request:", request);
    setIsEditing(true);
    setEditedRequest({ ...request });
    setActiveMenu(null);
  };

  const handleEditCancel = () => {
    console.log("Edit cancelled. Resetting form...");
    setIsEditing(false);
    setEditedRequest(null);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Starting save with data:", editedRequest);

      // First update personal info
      const personalInfoResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/personal-info/${editedRequest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullname: editedRequest.fullName,
            email: editedRequest.email,
            phonenumber: editedRequest.phone,
            status: editedRequest.status,
          }),
        }
      );

      if (!personalInfoResponse.ok) {
        throw new Error("Failed to update personal info");
      }

      const travelDetailsResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/travel-detail/${editedRequest.travelDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            PersonalID:
              Array.isArray(
                editedRequest.data?.TravelDetailsID?.[0]?.PersonalID
              ) &&
              editedRequest.data?.TravelDetailsID?.[0]?.PersonalID.length > 0
                ? editedRequest.data?.TravelDetailsID?.[0]?.PersonalID[0]
                : editedRequest.data?.TravelDetailsID?.[0]?.PersonalID,
            PreferredDestinations: Array.isArray(
              editedRequest.data?.TravelDetailsID?.[0]?.PreferredDestinations
            )
              ? editedRequest.data.TravelDetailsID[0].PreferredDestinations.join(
                  ", "
                )
              : editedRequest.data.TravelDetailsID[0].PreferredDestinations ||
                "",
            PreferredStartDate:
              editedRequest.data?.TravelDetailsID?.[0]?.PreferredStartDate,
            TripDurationDays:
              editedRequest.data?.TravelDetailsID?.[0]?.TripDurationDays,
            FlexibleDates:
              editedRequest.data?.TravelDetailsID?.[0]?.FlexibleDates,
            Adults: editedRequest.data?.TravelDetailsID?.[0]?.Adults,
            Children: editedRequest.data?.TravelDetailsID?.[0]?.Children,
            ChildrenAges:
              editedRequest.data?.TravelDetailsID?.[0]?.ChildrenAges,
          }),
        }
      );

      console.log(
        "Data yang dikirim ke backend:",
        JSON.stringify({
          PreferredDestinations:
            editedRequest.data?.TravelDetailsID?.[0]?.PreferredDestinations,
          PreferredStartDate:
            editedRequest.data?.TravelDetailsID?.[0]?.PreferredStartDate,
          TripDurationDays:
            editedRequest.data?.TravelDetailsID?.[0]?.TripDurationDays,
          FlexibleDates:
            editedRequest.data?.TravelDetailsID?.[0]?.FlexibleDates,
          Adults: editedRequest.data?.TravelDetailsID?.[0]?.Adults,
          Children: editedRequest.data?.TravelDetailsID?.[0]?.Children,
          ChildrenAges: editedRequest.data?.TravelDetailsID?.[0]?.ChildrenAges,
        })
      );

      const transportationResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/transportation-prefference/${editedRequest.travelDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            InternationalFlightRequired:
              editedRequest.data?.TransportationID?.[0]
                ?.InternationalFlightRequired,
            DepartureCity:
              editedRequest.data?.TransportationID?.[0]?.DepartureCity,
            DomesticFlightRequired:
              editedRequest.data?.TransportationID?.[0]?.DomesticFlightRequired,
            DomesticDepartureCity:
              editedRequest.data?.TransportationID?.[0]?.DomesticDepartureCity,
            PreferredTransportType:
              editedRequest.data?.TransportationID?.[0]?.PreferredTransportType,
          }),
        }
      );

      console.log(
        "Data yang dikirim ke backend:",
        JSON.stringify({
          TravelDetailsID: editedRequest.data?.TravelDetailsID?.[0]?.id,
          InternationalFlightRequired:
            editedRequest.data?.TransportationID?.[0]
              ?.InternationalFlightRequired,
          DepartureCity:
            editedRequest.data?.TransportationID?.[0]?.DepartureCity,
          DomesticFlightRequired:
            editedRequest.data?.TransportationID?.[0]?.DomesticFlightRequired,
          DomesticDepartureCity:
            editedRequest.data?.TransportationID?.[0]?.DomesticDepartureCity,
          PreferredTransportType:
            editedRequest.data?.TransportationID?.[0]?.PreferredTransportType,
        })
      );

      const responseTransport = await transportationResponse.json();
      console.log("TEST" + responseTransport);

      if (!transportationResponse.ok) {
        throw new Error("Failed to update transportation details");
      }

      const responseData = await travelDetailsResponse.json();
      console.log(responseData);

      if (!travelDetailsResponse.ok) {
        throw new Error("Failed to update travel details");
      }

      const activityResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/activity-interest/${editedRequest.travelDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            TravelDetailsID:
              editedRequest.data?.ActivityID?.[0]?.TravelDetailsID.id,
            PreferredActivities: Array.isArray(
              editedRequest.data?.ActivityID?.[0]?.PreferredActivities
            )
              ? editedRequest.data?.ActivityID?.[0]?.PreferredActivities.join(
                  ", "
                )
              : editedRequest.data?.ActivityID?.[0]?.PreferredActivities,
            ActivityLevel: editedRequest.data?.ActivityID?.[0]?.ActivityLevel,
            SpecialInterests:
              editedRequest.data?.ActivityID?.[0]?.SpecialInterests,
          }),
        }
      );

      if (!activityResponse.ok) {
        throw new Error("Failed to update activity details");
      }

      const accommodationResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/accommodation-prefference/${editedRequest.travelDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            TravelDetailsID:
              editedRequest.data?.AccommodationID?.[0]?.TravelDetailsID.id,
            PreferredAccommodationType:
              editedRequest.data?.AccommodationID?.[0]
                ?.PreferredAccommodationType,
            RoomType: editedRequest.data?.AccommodationID?.[0]?.RoomType,
            SpecialAccommodationRequests:
              editedRequest.data?.AccommodationID?.[0]
                ?.SpecialAccommodationRequests,
          }),
        }
      );

      if (!accommodationResponse.ok) {
        throw new Error("Failed to update accommodation details");
      }

      const mealPreferenceResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/meal-prefference/${editedRequest.travelDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            TravelDetailsID:
              editedRequest.data?.MealPreferenceID?.[0]?.TravelDetailsID?.id,
            MealPlanPreferences:
              editedRequest.data?.MealPreferenceID?.[0]?.MealPlanPreferences,
            DietaryRestrictions:
              editedRequest.data?.MealPreferenceID?.[0]?.DietaryRestrictions,
            SpecialFoodRequests:
              editedRequest.data?.MealPreferenceID?.[0]?.SpecialFoodRequests,
          }),
        }
      );

      if (!mealPreferenceResponse.ok) {
        throw new Error("Failed to update meal preferences");
      }

      const specialRequestResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/special-request/${editedRequest.travelDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            TravelDetailsID:
              editedRequest.data?.SpecialRequestID?.[0]?.TravelDetailsID?.id,
            OccasionsToCelebrate:
              editedRequest.data?.SpecialRequestID?.[0]?.occasionsToCelebrate,
            AdditionalServicesNeeded:
              editedRequest.data?.SpecialRequestID?.[0]
                ?.additionalServicesNeeded,
            SpecialRequestsNotes:
              editedRequest.data?.SpecialRequestID?.[0]?.specialRequestsNotes,
          }),
        }
      );

      if (!specialRequestResponse.ok) {
        throw new Error("Failed to update special requests");
      }

      const budgetResponse = await fetch(
        `https://demalayaapp-production.up.railway.app/api/v1/budget/${editedRequest.travelDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            TravelDetailsID: editedRequest.travelDetailId,
            Currency: editedRequest.data?.Currency,
            EstimatedBudgetPerPerson:
              editedRequest.data?.EstimatedBudgetPerPerson,
          }),
        }
      );

      if (!budgetResponse.ok) {
        throw new Error("Failed to update budget information");
      }

      // Create deep copy for local state update
      const updatedRequest = {
        ...editedRequest,
        data: {
          ...editedRequest.data,
          Currency: editedRequest.data.Currency,
          EstimatedBudgetPerPerson: editedRequest.data.EstimatedBudgetPerPerson,
        },
      };

      // Update local state
      setBookingRequests(
        bookingRequests.map((request) =>
          request.id === editedRequest.id ? updatedRequest : request
        )
      );
      setSelectedRequest(updatedRequest);
      setIsEditing(false);
      setEditedRequest(null);

      console.log("Save completed successfully");
    } catch (error) {
      console.error("Error during save:", error);
      // Add user feedback for error
    }
  };

  const handleFieldChange = (field, value) => {
    console.log("Field change:", { field, value });
    setEditedRequest((prev) => {
      const newData = { ...prev.data };
      const newRequest = { ...prev };
      console.log("Previous state:", prev);

      // Log the change being made
      console.log(`Updating ${field} with value:`, value);

      switch (field) {
        // Personal Info
        case "fullName":
          newRequest.fullName = value;
          break;
        case "email":
          newRequest.email = value;
          break;
        case "phone":
          newRequest.phone = value;
          break;

        // Travel Details
        case "adults":
          newData.TravelDetailsID[0].Adults = parseInt(value);
          break;
        case "children":
          newData.TravelDetailsID[0].Children = parseInt(value);
          if (parseInt(value) === 0) {
            newData.TravelDetailsID[0].ChildrenAges = "0";
          }
          break;
        case "startDate":
          newData.TravelDetailsID[0].PreferredStartDate = value;
          break;
        case "duration":
          newData.TravelDetailsID[0].TripDurationDays = parseInt(value);
          break;
        case "destinations":
          newData.TravelDetailsID[0].PreferredDestinations = value;
          break;
        case "isFlexible":
          newData.TravelDetailsID[0].FlexibleDates = value ? "Yes" : "No";
          break;
        case "childrenAges":
          newData.TravelDetailsID[0].ChildrenAges = value;
          break;

        // Transportation
        case "internationalFlight":
          newData.TransportationID[0].InternationalFlightRequired = value
            ? "Yes"
            : "No";
          break;
        case "domesticFlight":
          newData.TransportationID[0].DomesticFlightRequired = value
            ? "Yes"
            : "No";
          break;
        case "departureCity":
          newData.TransportationID[0].DepartureCity = value;
          break;
        case "domesticDepartureCity":
          newData.TransportationID[0].DomesticDepartureCity = value;
          break;
        case "transportType":
          newData.TransportationID[0].PreferredTransportType = value;
          break;

        // Accommodation
        case "accommodationType":
          newData.AccommodationID[0].PreferredAccommodationType = value;
          break;
        case "roomType":
          newData.AccommodationID[0].RoomType = value;
          break;
        case "specialAccommodationRequests":
          if (!newData.AccommodationID?.[0]) {
            newData.AccommodationID = [{}];
          }
          newData.AccommodationID[0].SpecialAccommodationRequests = value;
          break;

        // Activities
        case "activities":
          newData.ActivityID[0].PreferredActivities = Array.isArray(value)
            ? value.join(", ")
            : value;
          break;
        case "activityLevel":
          newData.ActivityID[0].ActivityLevel = value;
          break;
        case "specialInterests": // Add this case
          if (!newData.ActivityID?.[0]) {
            newData.ActivityID = [{}];
          }
          newData.ActivityID[0].SpecialInterests = value;
          break;

        // Add these cases for meal preferences
        case "MealPlanPreferences":
          if (!newData.MealPreferenceID?.[0]) {
            newData.MealPreferenceID = [{}];
          }
          newData.MealPreferenceID[0].MealPlanPreferences = value;
          break;

        case "DietaryRestrictions":
          if (!newData.MealPreferenceID?.[0]) {
            newData.MealPreferenceID = [{}];
          }
          newData.MealPreferenceID[0].DietaryRestrictions = value;
          break;

        case "SpecialFoodRequests":
          if (!newData.MealPreferenceID?.[0]) {
            newData.MealPreferenceID = [{}];
          }
          newData.MealPreferenceID[0].SpecialFoodRequests = value;
          break;

        // Add to handleFieldChange switch statement
        case "occasionsToCelebrate":
          if (!newData.SpecialRequestID?.[0]) {
            newData.SpecialRequestID = [{}];
          }
          newData.SpecialRequestID[0].occasionsToCelebrate = value;
          break;

        case "additionalServicesNeeded":
          if (!newData.SpecialRequestID?.[0]) {
            newData.SpecialRequestID = [{}];
          }
          newData.SpecialRequestID[0].additionalServicesNeeded = value;
          break;

        case "specialRequestsNotes":
          if (!newData.SpecialRequestID?.[0]) {
            newData.SpecialRequestID = [{}];
          }
          newData.SpecialRequestID[0].specialRequestsNotes = value;
          break;

        case "currency":
          newData.Currency = value;
          break;

        case "budget":
          newData.EstimatedBudgetPerPerson = value;
          break;

        default:
          return prev;
      }

      console.log("New state:", { ...newRequest, data: newData });
      return { ...newRequest, data: newData };
    });
  };

  console.log("editedRequest:", editedRequest);

  const filteredRequests = bookingRequests
    .filter((request) => {
      const matchesStatus =
        filterStatus === "all" || request.status === filterStatus;
      const matchesSearch =
        (request.fullName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (request.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      switch (sortBy) {
        case "date":
          return order * (new Date(a.date) - new Date(b.date));
        case "name":
          return order * a.fullName.localeCompare(b.fullName);
        case "budget":
          return order * (a.budget - b.budget);
        default:
          return 0;
      }
    });

  console.log("filteredRequests:", bookingRequests);

  const exportToExcel = () => {
    const exportData = filteredRequests.map((request) => ({
      "Full Name": request.fullname,
      Email: request.email,
      Status: request.status,
      Date: request.date,
      "Start Date": request.startDate,
      "Duration (days)": request.duration,
      Destinations: request.destinations?.join(", ") || "",

      Budget: `$${request.budget}`,
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `booking_requests_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/auth");
  };

  // Add effect to monitor modal state changes
  useEffect(() => {
    console.log("showLogoutModal changed to:", showLogoutModal);
  }, [showLogoutModal]);

  // Log states for debugging
  useEffect(() => {
    console.log("Modal state:", { showDeleteModal, toDeleteRequest });
  }, [showDeleteModal, toDeleteRequest]);

  console.log("showDeleteModal:", showDeleteModal);
  console.log("toDeleteRequest:", toDeleteRequest);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking requests...</p>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="error-container">
  //       <p className="error-message">{error}</p>
  //       <button
  //         onClick={() => window.location.reload()}
  //         className="retry-button"
  //       >
  //         <i className="fas fa-redo"></i> Retry
  //       </button>
  //     </div>
  //   );
  // }

  const renderRequestCard = (request) => (
    <div className="request-details">
      <p>
        <strong>Date:</strong>{" "}
        {new Date(request.date).toLocaleDateString("en-GB")}
      </p>
      <p>
        <strong>Email:</strong> {request.email}
      </p>
      <p>
        <strong>Destinations:</strong>{" "}
        <div className="destinations-list">
          {renderDestinations(
            request.data?.TravelDetailsID?.[0]?.PreferredDestinations
          )}
        </div>
      </p>
      <p>
        <strong>Budget:</strong> {request.data?.Currency}{" "}
        {request.data?.EstimatedBudgetPerPerson}
      </p>
    </div>
  );

  const renderOverviewDetails = () => (
    <div className="key-details">
      {isEditing ? (
        <>
          <div className="personal-info-section">
            {/* Personal info fields */}
            <EditableField
              value={editedRequest.fullName}
              onChange={(value) => handleFieldChange("fullName", value)}
              label="Full Name"
            />
            <EditableField
              value={editedRequest.email}
              onChange={(value) => handleFieldChange("email", value)}
              label="Email Address"
            />
            <EditableField
              value={editedRequest.phone}
              onChange={(value) => handleFieldChange("phone", value)}
              label="Phone Number"
            />
          </div>

          {/* Read-only travel info */}
          <div className="readonly-field">
            <label>Travel Details:</label>
            <p>
              {editedRequest.data?.TravelDetailsID?.[0]?.Adults || 0} Adults,{" "}
              {editedRequest.data?.TravelDetailsID?.[0]?.Children || 0} Children
            </p>
            <p>
              {editedRequest.data?.TravelDetailsID?.[0]?.TripDurationDays || 0}{" "}
              Days from{" "}
              {new Date(
                editedRequest.data?.TravelDetailsID?.[0]?.PreferredStartDate
              ).toLocaleDateString()}
            </p>
            <p>
              Budget: {editedRequest.data?.Currency || "USD"} -{" "}
              {editedRequest.data?.EstimatedBudgetPerPerson || 0} per person
            </p>

            <label>Destinations:</label>
            <div className="destinations-list readonly">
              {renderDestinations(
                editedRequest.data?.TravelDetailsID?.[0]?.PreferredDestinations
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="key-item">
            <i className="fas fa-users"></i>
            <span>
              {selectedRequest.data?.TravelDetailsID?.[0]?.Adults || 0} Adults,{" "}
              {selectedRequest.data?.TravelDetailsID?.[0]?.Children || 0}{" "}
              Children
            </span>
          </div>
          <div className="key-item">
            <i className="fas fa-calendar-alt"></i>
            <span>
              {selectedRequest.data?.TravelDetailsID?.[0]?.TripDurationDays ||
                0}{" "}
              Days from{" "}
              {new Date(
                selectedRequest.data?.TravelDetailsID?.[0]?.PreferredStartDate
              ).toLocaleDateString()}
            </span>
          </div>
          <div className="key-item">
            <i className="fas fa-wallet"></i>
            <span>
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: (
                  selectedRequest.data?.Currency || "USD - US Dollar"
                ).split(" ")[0],
              }).format(
                selectedRequest.data?.EstimatedBudgetPerPerson || 0
              )}{" "}
              per person
            </span>
          </div>
          <div className="key-item">
            <i className="fas fa-map-marker-alt"></i>
            <div className="destinations-list">
              {renderDestinations(
                selectedRequest.data?.TravelDetailsID?.[0]
                  ?.PreferredDestinations
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderOverviewTab = () => (
    <>
      <div className={`detail-section highlight ${isEditing ? "editing" : ""}`}>
        <div className="client-info">
          {/* Only show these fields when not editing */}
          {!isEditing && (
            <div className="client-header">
              <h3>{selectedRequest.fullName}</h3>
              <p>
                {selectedRequest.email} • {selectedRequest.phone || "No phone"}
              </p>
            </div>
          )}
          {renderOverviewDetails()}
        </div>
      </div>

      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-map-marker-alt"></i> Destinations
        </h3>
        <div className="destinations-list readonly">
          {renderDestinations(
            selectedRequest.data?.TravelDetailsID?.[0]?.PreferredDestinations
          )}
        </div>
      </div>
    </>
  );

  const renderDestinations = (destinationsData) => {
    if (!destinationsData) return "No destinations available";
    if (typeof destinationsData === "string") {
      return destinationsData.includes(",") ? (
        destinationsData.split(",").map((dest) => (
          <span key={dest.trim()} className="destination-tag">
            {dest.trim()}
          </span>
        ))
      ) : (
        <span className="destination-tag">{destinationsData}</span>
      );
    }
    return <span className="destination-tag">{String(destinationsData)}</span>;
  };

  const renderTravelDetails = () => (
    <>
      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-globe-asia"></i> Travel Details
        </h3>
        {isEditing ? (
          <>
            <EditableField
              type="array"
              value={
                editedRequest.data?.TravelDetailsID?.[0]?.PreferredDestinations
              }
              onChange={(value) => handleFieldChange("destinations", value)}
              label="Select Destinations"
            />
            <EditableField
              type="date"
              value={
                editedRequest.data?.TravelDetailsID?.[0]?.PreferredStartDate
                  ? new Date(
                      editedRequest.data.TravelDetailsID[0].PreferredStartDate
                    )
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(value) => handleFieldChange("startDate", value)}
              label="Travel Start Date"
            />
            <EditableField
              type="number"
              value={editedRequest.data?.TravelDetailsID?.[0]?.TripDurationDays}
              onChange={(value) => handleFieldChange("duration", value)}
              label="Duration (Days)"
            />

            <div className="form-group">
              <label>Date Flexibility:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={
                      editedRequest.data?.TravelDetailsID?.[0]
                        ?.FlexibleDates === "Yes"
                    }
                    onChange={() => handleFieldChange("isFlexible", true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    checked={
                      editedRequest.data?.TravelDetailsID?.[0]
                        ?.FlexibleDates === "No"
                    }
                    onChange={() => handleFieldChange("isFlexible", false)}
                  />{" "}
                  No
                </label>
              </div>
            </div>

            <EditableField
              type="number"
              value={editedRequest.data?.TravelDetailsID?.[0]?.Adults || 0}
              onChange={(value) => handleFieldChange("adults", value)}
              label="Number of Adults"
            />
            <EditableField
              type="number"
              value={editedRequest.data?.TravelDetailsID?.[0]?.Children || 0}
              onChange={(value) => handleFieldChange("children", value)}
              label="Number of Children"
            />
            {editedRequest.data?.TravelDetailsID?.[0]?.Children > 0 && (
              <EditableField
                type="text"
                value={
                  editedRequest.data?.TravelDetailsID?.[0]?.ChildrenAges || ""
                }
                onChange={(value) => handleFieldChange("childrenAges", value)}
                label="Children Ages (comma separated)"
                placeholder="Enter ages separated by commas (e.g., 5,7,12)"
              />
            )}
          </>
        ) : (
          <>
            <p>
              <strong>Destinations:</strong>{" "}
              {selectedRequest.data?.TravelDetailsID?.[0]
                ?.PreferredDestinations || "Not specified"}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(
                selectedRequest.data?.TravelDetailsID?.[0]?.PreferredStartDate
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {selectedRequest.data?.TravelDetailsID?.[0]?.TripDurationDays ||
                0}{" "}
              days
            </p>
            <p>
              <strong>Date Flexibility:</strong>{" "}
              {selectedRequest.data?.TravelDetailsID?.[0]?.FlexibleDates ||
                "No"}
            </p>
            <p>
              <strong>Number of Adults:</strong>{" "}
              {selectedRequest.data?.TravelDetailsID?.[0]?.Adults || 0}
            </p>
            <p>
              <strong>Number of Children:</strong>{" "}
              {selectedRequest.data?.TravelDetailsID?.[0]?.Children || 0}
            </p>
            {selectedRequest.data?.TravelDetailsID?.[0]?.Children > 0 && (
              <p>
                <strong>Children Ages:</strong>{" "}
                {selectedRequest.data?.TravelDetailsID?.[0]?.ChildrenAges ||
                  "Not specified"}
              </p>
            )}
          </>
        )}
      </div>

      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-plane"></i> Transportation
        </h3>
        {isEditing ? (
          <>
            <div className="form-group">
              <label>International Flight Required:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={
                      editedRequest.data?.TransportationID?.[0]
                        ?.InternationalFlightRequired === "Yes"
                    }
                    onChange={() =>
                      handleFieldChange("internationalFlight", true)
                    }
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    checked={
                      editedRequest.data?.TransportationID?.[0]
                        ?.InternationalFlightRequired === "No"
                    }
                    onChange={() =>
                      handleFieldChange("internationalFlight", false)
                    }
                  />{" "}
                  No
                </label>
              </div>
            </div>

            {editedRequest.data?.TransportationID?.[0]
              ?.InternationalFlightRequired === "Yes" && (
              <EditableField
                value={editedRequest.data?.TransportationID?.[0]?.DepartureCity}
                onChange={(value) => handleFieldChange("departureCity", value)}
                label="International Departure City"
              />
            )}

            <div className="form-group">
              <label>Domestic Flight Required:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={
                      editedRequest.data?.TransportationID?.[0]
                        ?.DomesticFlightRequired === "Yes"
                    }
                    onChange={() => handleFieldChange("domesticFlight", true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    checked={
                      editedRequest.data?.TransportationID?.[0]
                        ?.DomesticFlightRequired === "No"
                    }
                    onChange={() => handleFieldChange("domesticFlight", false)}
                  />{" "}
                  No
                </label>
              </div>
            </div>

            {editedRequest.data?.TransportationID?.[0]
              ?.DomesticFlightRequired === "Yes" && (
              <EditableField
                value={
                  editedRequest.data?.TransportationID?.[0]
                    ?.DomesticDepartureCity
                }
                onChange={(value) =>
                  handleFieldChange("domesticDepartureCity", value)
                }
                label="Domestic Departure City"
              />
            )}

            <EditableField
              type="select"
              value={
                editedRequest.data?.TransportationID?.[0]
                  ?.PreferredTransportType
              }
              onChange={(value) => handleFieldChange("transportType", value)}
              options={[
                {
                  value: "Private Car with Driver",
                  label: "Private Car with Driver",
                },
                {
                  value: "Shared Van/Bus Service",
                  label: "Shared Van/Bus Service",
                },
                {
                  value: "Self-Drive Rental Car",
                  label: "Self-Drive Rental Car",
                },
                {
                  value: "Motorcycle Rental",
                  label: "Motorcycle Rental",
                },
                {
                  value: "Boat/Ferry Service",
                  label: "Boat/Ferry Service",
                },
                {
                  value: "Luxury Vehicle Service",
                  label: "Luxury Vehicle Service",
                },
                {
                  value: "Mixed Transportation",
                  label: "Mixed Transportation",
                },
              ]}
              label="Preferred Transport Type"
            />
          </>
        ) : (
          <>
            <p>
              <strong>International Flight:</strong>{" "}
              {selectedRequest.data?.TransportationID?.[0]
                ?.InternationalFlightRequired || "No"}
            </p>
            {selectedRequest.data?.TransportationID?.[0]
              ?.InternationalFlightRequired === "Yes" && (
              <p>
                <strong>International Departure City:</strong>{" "}
                {selectedRequest.data?.TransportationID?.[0]?.DepartureCity ||
                  "Not specified"}
              </p>
            )}
            <p>
              <strong>Domestic Flight:</strong>{" "}
              {selectedRequest.data?.TransportationID?.[0]
                ?.DomesticFlightRequired || "No"}
            </p>
            {selectedRequest.data?.TransportationID?.[0]
              ?.DomesticFlightRequired === "Yes" && (
              <p>
                <strong>Domestic Departure City:</strong>{" "}
                {selectedRequest.data?.TransportationID?.[0]
                  ?.DomesticDepartureCity || "Not specified"}
              </p>
            )}
            <p>
              <strong>Transport Type:</strong>{" "}
              {selectedRequest.data?.TransportationID?.[0]
                ?.PreferredTransportType || "Not specified"}
            </p>
          </>
        )}
      </div>

      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-hiking"></i> Activities
        </h3>
        {isEditing ? (
          <>
            <EditableField
              type="array"
              value={editedRequest.data?.ActivityID?.[0]?.PreferredActivities}
              onChange={(value) => handleFieldChange("activities", value)}
              label="Activity"
            />
            <EditableField
              type="select"
              value={editedRequest.data?.ActivityID?.[0]?.ActivityLevel}
              onChange={(value) => handleFieldChange("activityLevel", value)}
              options={activityLevels}
              label="Activity Level"
            />
            <EditableField
              value={editedRequest.data?.ActivityID?.[0]?.SpecialInterests}
              onChange={(value) => handleFieldChange("specialInterests", value)}
              label="Special Interests"
            />
          </>
        ) : (
          <>
            <p>
              <strong>Selected Activities:</strong>{" "}
              {selectedRequest.data?.ActivityID?.[0]?.PreferredActivities ||
                "Not specified"}
            </p>
            <p>
              <strong>Activity Level:</strong>{" "}
              {selectedRequest.data?.ActivityID?.[0]?.ActivityLevel ||
                "Not specified"}
            </p>
            <p>
              <strong>Special Interests:</strong>{" "}
              {selectedRequest.data?.ActivityID?.[0]?.SpecialInterests ||
                "None"}
            </p>
          </>
        )}
      </div>
    </>
  );

  const renderAccommodationDetails = () => (
    <>
      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-hotel"></i> Accommodation
        </h3>
        {isEditing ? (
          <>
            <EditableField
              type="select"
              value={
                editedRequest.data?.AccommodationID?.[0]
                  ?.PreferredAccommodationType
              }
              onChange={(value) =>
                handleFieldChange("accommodationType", value)
              }
              options={accommodationTypes}
              label="Accommodation Type"
            />
            <EditableField
              type="select"
              value={editedRequest.data?.AccommodationID?.[0]?.RoomType}
              onChange={(value) => handleFieldChange("roomType", value)}
              options={roomTypes}
              label="Room Type"
            />
            <EditableField
              type="textarea"
              value={
                editedRequest.data?.AccommodationID?.[0]
                  ?.SpecialAccommodationRequests
              }
              onChange={(value) =>
                handleFieldChange("specialAccommodationRequests", value)
              }
              label="Special Accommodation Requests"
              placeholder="Enter any special accommodation requests..."
            />
          </>
        ) : (
          <>
            <p>
              <strong>Type:</strong>{" "}
              {selectedRequest.data?.AccommodationID?.[0]
                ?.PreferredAccommodationType || "Not specified"}
            </p>
            <p>
              <strong>Room Type:</strong>{" "}
              {selectedRequest.data?.AccommodationID?.[0]?.RoomType ||
                "Not specified"}
            </p>
            <p>
              <strong>Special Requests:</strong>{" "}
              {selectedRequest.data?.AccommodationID?.[0]
                ?.SpecialAccommodationRequests || "None"}
            </p>
          </>
        )}
      </div>
      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-utensils"></i> Meal Preferences
        </h3>
        {isEditing ? (
          <>
            <EditableField
              type="select"
              value={
                editedRequest.data?.MealPreferenceID?.[0]?.MealPlanPreferences
              }
              onChange={(value) =>
                handleFieldChange("MealPlanPreferences", value)
              }
              options={[
                {
                  value: "All-Inclusive (All Meals)",
                  label: "All-Inclusive (All Meals)",
                },
                { value: "Breakfast Only", label: "Breakfast Only" },
                {
                  value: "Half Board (Breakfast & Dinner)",
                  label: "Half Board (Breakfast & Dinner)",
                },
                {
                  value: "Full Board (All Meals)",
                  label: "Full Board (All Meals)",
                },
                {
                  value: "Pay As You Go",
                  label: "Pay As You Go",
                },
                {
                  value: "Custom Plan",
                  label: "Custom Plan",
                },
              ]}
              label="Meal Plan Preferences"
            />
            <EditableField
              type="textarea"
              value={
                editedRequest.data?.MealPreferenceID?.[0]?.DietaryRestrictions
              }
              onChange={(value) =>
                handleFieldChange("DietaryRestrictions", value)
              }
              label="Dietary Restrictions"
              placeholder="Enter any dietary restrictions..."
            />
            <EditableField
              type="textarea"
              value={
                editedRequest.data?.MealPreferenceID?.[0]?.SpecialFoodRequests
              }
              onChange={(value) =>
                handleFieldChange("SpecialFoodRequests", value)
              }
              label="Special Food Requests"
              placeholder="Enter any special food requests..."
            />
          </>
        ) : (
          <>
            <p>
              <strong>Meal Plan:</strong>{" "}
              {selectedRequest.data?.MealPreferenceID?.[0]
                ?.MealPlanPreferences || "Not specified"}
            </p>
            <p>
              <strong>Dietary Restrictions:</strong>{" "}
              {selectedRequest.data?.MealPreferenceID?.[0]
                ?.DietaryRestrictions || "None"}
            </p>
            <p>
              <strong>Special Food Requests:</strong>{" "}
              {selectedRequest.data?.MealPreferenceID?.[0]
                ?.SpecialFoodRequests || "Not specified"}
            </p>
          </>
        )}
      </div>
    </>
  );

  const renderExtrasDetails = () => (
    <>
      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-gift"></i> Special Requests
        </h3>
        {isEditing ? (
          <>
            <EditableField
              type="text"
              value={
                editedRequest.data?.SpecialRequestID?.[0]?.OccasionsToCelebrate
              }
              onChange={(value) =>
                handleFieldChange("occasionsToCelebrate", value)
              }
              label="Occasions to Celebrate"
              placeholder="Enter any special occasions..."
            />
            <EditableField
              type="text"
              value={
                editedRequest.data?.SpecialRequestID?.[0]
                  ?.AdditionalServicesNeeded
              }
              onChange={(value) =>
                handleFieldChange("additionalServicesNeeded", value)
              }
              label="Additional Services Needed"
              placeholder="Enter any additional services..."
            />
            <EditableField
              type="textarea"
              value={
                editedRequest.data?.SpecialRequestID?.[0]?.SpecialRequestsNotes
              }
              onChange={(value) =>
                handleFieldChange("specialRequestsNotes", value)
              }
              label="Special Request Notes"
              placeholder="Enter any special request notes..."
            />
          </>
        ) : (
          <>
            <p>
              <strong>Occasions to Celebrate:</strong>{" "}
              {selectedRequest.data?.SpecialRequestID?.[0]
                ?.OccasionsToCelebrate || "None"}
            </p>
            <p>
              <strong>Additional Services:</strong>{" "}
              {selectedRequest.data?.SpecialRequestID?.[0]
                ?.AdditionalServicesNeeded || "None"}
            </p>
            <p>
              <strong>Special Request Notes:</strong>{" "}
              {selectedRequest.data?.SpecialRequestID?.[0]
                ?.SpecialRequestsNotes || "None"}
            </p>
          </>
        )}
      </div>

      <div className={`detail-section ${isEditing ? "editing" : ""}`}>
        <h3>
          <i className="fas fa-wallet"></i> Budget Information
        </h3>
        {isEditing ? (
          <>
            <EditableField
              type="select"
              value={editedRequest.data?.Currency}
              onChange={(value) => handleFieldChange("currency", value)}
              options={[
                { value: "USD - US Dollar", label: "USD - US Dollar" },
                { value: "EUR - Euro", label: "EUR - Euro" },
                { value: "GBP - British Pound", label: "GBP - British Pound" },
                {
                  value: "IDR - Indonesian Rupiah",
                  label: "IDR - Indonesian Rupiah",
                },
                {
                  value: "AUD - Australian Dollar",
                  label: "AUD - Australian Dollar",
                },
                {
                  value: "SGD - Singapore Dollar",
                  label: "SGD - Singapore Dollar",
                },
                {
                  value: "MYR - Malaysian Ringgit",
                  label: "MYR - Malaysian Ringgit",
                },
              ]}
              label="Currency"
            />
            <EditableField
              type="number"
              value={editedRequest.data?.EstimatedBudgetPerPerson}
              onChange={(value) => handleFieldChange("budget", value)}
              label="Estimated Budget per Person"
              placeholder="Enter budget amount..."
              min="0"
              step="100"
            />
          </>
        ) : (
          <>
            <p>
              <strong>Currency:</strong>{" "}
              {selectedRequest.data?.Currency || "USD - US Dollar"}
            </p>
            <p>
              <strong>Budget per Person:</strong>{" "}
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: (
                  selectedRequest.data?.Currency || "USD - US Dollar"
                ).split(" ")[0],
              }).format(selectedRequest.data?.EstimatedBudgetPerPerson || 0)}
            </p>
          </>
        )}
      </div>

      {/* <div className="detail-section">
        <h3>
          <i className="fas fa-info-circle"></i> Source Information
        </h3>
        <p>
          <strong>Heard From:</strong>{" "}
          {selectedRequest.data?.TravelDetailsID?.[0]?.HeardFrom ||
            "Not specified"}
        </p>
      </div> */}
    </>
  );

  return (
    <div className="root-container" style={{ position: "relative" }}>
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-content">
            <h1>
              <i className="fas fa-tasks"></i> Booking Requests Dashboard
            </h1>
            <button
              onClick={handleLogoutClick}
              className="logout-btn"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
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
              <option value="all">🔍 All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">📅 Sort by Date</option>
              <option value="name">👤 Sort by Name</option>
              <option value="budget">💰 Sort by Budget</option>
            </select>
            <button
              onClick={() =>
                setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
              }
              className="sort-order-btn"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
            <button
              onClick={exportToExcel}
              className="export-btn"
              title="Export to Excel"
            >
              <i className="fas fa-file-excel"></i> Export
            </button>
          </div>
        </header>

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
                  className={`request-card ${request.status} ${
                    selectedRequest?.id === request.id ? "selected" : ""
                  }`}
                  onClick={(e) => handleCardClick(request, e)}
                >
                  <div className="card-menu">
                    <button
                      className="menu-trigger"
                      onClick={(e) => toggleMenu(request.id, e)}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {activeMenu === request.id && (
                      <div className="menu-dropdown">
                        <button onClick={(e) => handleEditStart(request, e)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button onClick={(e) => handleDelete(request, e)}>
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="request-header">
                    <h3>{request.fullName}</h3>
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                  {renderRequestCard(request)}
                </div>
              ))
            )}
          </div>

          {selectedRequest && (
            <div className="request-detail-panel">
              <button
                className="close-detail-btn"
                onClick={() => setSelectedRequest(null)}
                title="Close details"
              >
                ×
              </button>
              <div className="detail-header">
                <h2>
                  <i className="fas fa-info-circle"></i>
                  Booking Request Details
                </h2>
                <div className="quick-actions">
                  <button
                    onClick={() => handleQuickAction("email")}
                    className="action-btn email"
                  >
                    <i className="fas fa-envelope"></i> Email
                  </button>
                  {selectedRequest.phone && (
                    <button
                      onClick={() => handleQuickAction("whatsapp")}
                      className="action-btn whatsapp"
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </button>
                  )}
                  <button onClick={handlePrint} className="action-btn print">
                    <i className="fas fa-print"></i> Print All
                  </button>
                </div>
              </div>

              <div className="status-bar">
                <div className="status-info">
                  <span className={`status-badge ${selectedRequest.status}`}>
                    {selectedRequest.status}
                  </span>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) =>
                      handleStatusChange(selectedRequest.id, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="booking-meta">
                  <span>
                    <i className="fas fa-calendar"></i> {selectedRequest.date}
                  </span>
                  <span>
                    <i className="fas fa-user"></i> ID: {selectedRequest.id}
                  </span>
                </div>
              </div>

              <div className="detail-tabs">
                <button
                  className={`tab-btn ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <i className="fas fa-home"></i> Overview
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "travel" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("travel")}
                >
                  <i className="fas fa-plane"></i> Travel
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "accommodation" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("accommodation")}
                >
                  <i className="fas fa-hotel"></i> Accommodation
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "extras" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("extras")}
                >
                  <i className="fas fa-plus-circle"></i> Extras
                </button>
              </div>

              <div className="detail-content">
                <div
                  data-tab="overview"
                  style={{
                    display: activeTab === "overview" ? "block" : "none",
                  }}
                >
                  {renderOverviewTab()}
                </div>

                <div
                  data-tab="travel"
                  style={{ display: activeTab === "travel" ? "block" : "none" }}
                >
                  {renderTravelDetails()}
                </div>

                <div
                  data-tab="accommodation"
                  style={{
                    display: activeTab === "accommodation" ? "block" : "none",
                  }}
                >
                  {renderAccommodationDetails()}
                </div>

                <div
                  data-tab="extras"
                  style={{ display: activeTab === "extras" ? "block" : "none" }}
                >
                  {renderExtrasDetails()}
                </div>
              </div>
              {isEditing && (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <i className="fas fa-check"></i> Save Changes
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal && toDeleteRequest}
        request={toDeleteRequest}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
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

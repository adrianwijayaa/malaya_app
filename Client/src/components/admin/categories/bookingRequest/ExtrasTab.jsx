import React, { useEffect, useState } from "react";
import api from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "./ExtrasTab.css";

const ExtrasTab = ({ selectedRequest, onDataUpdate }) => {
  const [extras, setExtras] = useState({
    InternationalFlightRequired: false,
    DepartureCity: "",
    DomesticFlightRequired: false,
    DomesticDepartureCity: "",
    PreferredTransportType: "",

    DietaryRestrictions: "",
    MealPlanPreferences: "",
    SpecialFoodRequests: "",

    OccasionsToCelebrate: "",
    AdditionalServicesNeeded: "",
    SpecialRequestsNotes: "",

    PreferredActivities: "",
    ActivityLevel: "",
    SpecialInterests: "",

    HowDidYouHear: "",
    Consent: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedRequest?.id || !selectedRequest?.travelId) return;

    const fetchExtras = async () => {
      try {
        console.log(
          `🔍 Checking relation | PersonalID: ${selectedRequest.id} | TravelID: ${selectedRequest.travelId}`
        );

        // 1️⃣ Ambil semua data extras
        const [transportAll, mealAll, specialAll, activityAll, submissionAll] =
          await Promise.all([
            api.get("/transportation-prefferences"),
            api.get("/meal-prefferences"),
            api.get("/special-requests"),
            api.get("/activity-interests"),
            api.get("/submissions"),
          ]);

        // 2️⃣ Cari yang TravelDetailsID-nya match
        const travelId = selectedRequest.travelId;
        const findByTravel = (arr) =>
          arr.data?.find((x) =>
            Array.isArray(x.TravelDetailsID)
              ? x.TravelDetailsID.some((t) => t.id === travelId)
              : x.TravelDetailsID?.id === travelId
          );

        const transport = findByTravel(transportAll) || {};
        const meal = findByTravel(mealAll) || {};
        const special = findByTravel(specialAll) || {};
        const activity = findByTravel(activityAll) || {};
        // 🧩 Cek submission berdasarkan PersonalID yg terkait TravelID
        const submission =
          submissionAll.data?.find((x) => {
            const hasPersonalMatch = Array.isArray(x.PersonalID)
              ? x.PersonalID.some(
                  (p) =>
                    p.id === selectedRequest.personalId ||
                    p.id === selectedRequest.id
                )
              : x.PersonalID?.id === selectedRequest.personalId ||
                x.PersonalID?.id === selectedRequest.id;

            return hasPersonalMatch;
          }) || {};

        console.log("✅ Matched Special Request:", special);
        console.log("✅ Matched Meal Pref:", meal);
        console.log("✅ Matched Activity:", activity);

        // 3️⃣ Set state dari hasil yang match
        setExtras({
          InternationalFlightRequired:
            transport.InternationalFlightRequired || false,
          DepartureCity: transport.DepartureCity || "",
          DomesticFlightRequired: transport.DomesticFlightRequired || false,
          DomesticDepartureCity: transport.DomesticDepartureCity || "",
          PreferredTransportType: transport.PreferredTransportType || "",

          DietaryRestrictions: meal.DietaryRestrictions || "",
          MealPlanPreferences: meal.MealPlanPreferences || "",
          SpecialFoodRequests: meal.SpecialFoodRequests || "",

          OccasionsToCelebrate: special.OccasionsToCelebrate || "",
          AdditionalServicesNeeded: special.AdditionalServicesNeeded || "",
          SpecialRequestsNotes: special.SpecialRequestsNotes || "",

          PreferredActivities: activity.PreferredActivities || "",
          ActivityLevel: activity.ActivityLevel || "",
          SpecialInterests: activity.SpecialInterests || "",

          HowDidYouHear: submission.HowDidYouHear || "",
          Consent: submission.Consent || false,
        });
      } catch (err) {
        console.error("Failed to fetch or match extras:", err);
      }
    };

    fetchExtras();
  }, [selectedRequest]);

  const handleChange = (field, value) => {
    setExtras((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedRequest?.id) return;
    setIsSaving(true);
    try {
      await Promise.allSettled([
        api.put(`/transportation-prefference/${selectedRequest.id}`, {
          TravelDetailsID: selectedRequest.id,
          InternationalFlightRequired: extras.InternationalFlightRequired,
          DepartureCity: extras.DepartureCity,
          DomesticFlightRequired: extras.DomesticFlightRequired,
          DomesticDepartureCity: extras.DomesticDepartureCity,
          PreferredTransportType: extras.PreferredTransportType,
        }),
        api.put(`/meal-prefference/${selectedRequest.id}`, {
          TravelDetailsID: selectedRequest.id,
          DietaryRestrictions: extras.DietaryRestrictions,
          MealPlanPreferences: extras.MealPlanPreferences,
          SpecialFoodRequests: extras.SpecialFoodRequests,
        }),
        api.put(`/special-request/${selectedRequest.id}`, {
          TravelDetailsID: selectedRequest.id,
          OccasionsToCelebrate: extras.OccasionsToCelebrate,
          AdditionalServicesNeeded: extras.AdditionalServicesNeeded,
          SpecialRequestsNotes: extras.SpecialRequestsNotes,
        }),
        api.put(`/activity-interest/${selectedRequest.id}`, {
          TravelDetailsID: selectedRequest.id,
          PreferredActivities: extras.PreferredActivities,
          ActivityLevel: extras.ActivityLevel,
          SpecialInterests: extras.SpecialInterests,
        }),
      ]);

      toast.success("✅ Extras saved successfully!", {
        toastId: "extras-save-success",
      });

      if (onDataUpdate) await onDataUpdate();
    } catch (err) {
      console.error("Failed to save extras:", err);
      toast.error("❌ Failed to save extras.", {
        toastId: "extras-save-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="extras-tab">
      <h3>
        <i className="fas fa-plus-circle"></i> Extras & Requests
      </h3>

      <section>
        <h4>Transportation Preference</h4>
        <div className="extras-grid">
          <div className="extras-field">
            <label>International Flight Required</label>
            <select
              value={extras.InternationalFlightRequired ? "Yes" : "No"}
              onChange={(e) =>
                handleChange(
                  "InternationalFlightRequired",
                  e.target.value === "Yes"
                )
              }
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="extras-field">
            <label>Departure City</label>
            <input
              type="text"
              value={extras.DepartureCity}
              onChange={(e) => handleChange("DepartureCity", e.target.value)}
            />
          </div>

          <div className="extras-field">
            <label>Domestic Flight Required</label>
            <select
              value={extras.DomesticFlightRequired ? "Yes" : "No"}
              onChange={(e) =>
                handleChange("DomesticFlightRequired", e.target.value === "Yes")
              }
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="extras-field">
            <label>Domestic Departure City</label>
            <input
              type="text"
              value={extras.DomesticDepartureCity}
              onChange={(e) =>
                handleChange("DomesticDepartureCity", e.target.value)
              }
            />
          </div>

          <div className="extras-field full">
            <label>Preferred Transport Type</label>
            <select
              value={extras.PreferredTransportType}
              onChange={(e) =>
                handleChange("PreferredTransportType", e.target.value)
              }
            >
              <option value="">Select Transport Type</option>
              <option value="Private Car with Driver">
                Private Car with Driver
              </option>
              <option value="Shared Van/Bus Service">
                Shared Van/Bus Service
              </option>
              <option value="Self-Drive Rental Car">
                Self-Drive Rental Car
              </option>
              <option value="Motorcycle Rental">Motorcycle Rental</option>
              <option value="Boat/Ferry Service">Boat/Ferry Service</option>
              <option value="Luxury Vehicle Service">
                Luxury Vehicle Service
              </option>
              <option value="Mixed Transportation">Mixed Transportation</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h4>Meal Preference</h4>
        <div className="extras-grid">
          <div className="extras-field">
            <label>Dietary Restrictions</label>
            <input
              type="text"
              value={extras.DietaryRestrictions}
              onChange={(e) =>
                handleChange("DietaryRestrictions", e.target.value)
              }
            />
          </div>

          <div className="extras-field">
            <label>Meal Plan</label>
            <select
              value={extras.MealPlanPreferences}
              onChange={(e) =>
                handleChange("MealPlanPreferences", e.target.value)
              }
            >
              <option value="">Select Meal Plan</option>
              <option value="All-Inclusive (All Meals)">
                All-Inclusive (All Meals)
              </option>
              <option value="Breakfast Only">Breakfast Only</option>
              <option value="Half Board (Breakfast & Dinner)">
                Half Board (Breakfast & Dinner)
              </option>
              <option value="Full Board (All Meals)">
                Full Board (All Meals)
              </option>
              <option value="Pay As You Go">Pay As You Go</option>
              <option value="Custom Plan">Custom Plan</option>
            </select>
          </div>

          <div className="extras-field full">
            <label>Special Food Requests</label>
            <textarea
              rows="3"
              value={extras.SpecialFoodRequests}
              onChange={(e) =>
                handleChange("SpecialFoodRequests", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h4>Special Requests</h4>
        <div className="extras-grid">
          <div className="extras-field">
            <label>Occasions to Celebrate</label>
            <input
              type="text"
              value={extras.OccasionsToCelebrate}
              onChange={(e) =>
                handleChange("OccasionsToCelebrate", e.target.value)
              }
            />
          </div>
          <div className="extras-field">
            <label>Additional Services Needed</label>
            <input
              type="text"
              value={extras.AdditionalServicesNeeded}
              onChange={(e) =>
                handleChange("AdditionalServicesNeeded", e.target.value)
              }
            />
          </div>
          <div className="extras-field full">
            <label>Special Requests Notes</label>
            <textarea
              rows="3"
              value={extras.SpecialRequestsNotes}
              onChange={(e) =>
                handleChange("SpecialRequestsNotes", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h4>Activity Interests</h4>
        <div className="extras-grid">
          <div className="extras-field">
            <label>Preferred Activities</label>
            <input
              type="text"
              value={extras.PreferredActivities}
              onChange={(e) =>
                handleChange("PreferredActivities", e.target.value)
              }
            />
          </div>

          <div className="extras-field">
            <label>Activity Level</label>
            <select
              value={extras.ActivityLevel}
              onChange={(e) => handleChange("ActivityLevel", e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="Relaxed (Minimal physical activity)">
                Relaxed (Minimal physical activity)
              </option>
              <option value="Moderate (Some Walking, Light Activities)">
                Moderate (Some Walking, Light Activities)
              </option>
              <option value="Active (Regular activities, longer walks)">
                Active (Regular activities, longer walks)
              </option>
              <option value="Challenging (Strenuous activities, hiking)">
                Challenging (Strenuous activities, hiking)
              </option>
              <option value="Mixed (Combination of activity levels)">
                Mixed (Combination of activity levels)
              </option>
            </select>
          </div>

          <div className="extras-field full">
            <label>Special Interests</label>
            <textarea
              rows="3"
              value={extras.SpecialInterests}
              onChange={(e) => handleChange("SpecialInterests", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <h4>Submission Summary</h4>
        <div className="extras-grid">
          <div className="extras-field readonly">
            <label>How Did You Hear About Us?</label>
            <input type="text" value={extras.HowDidYouHear} readOnly />
          </div>
          <div className="extras-field readonly">
            <label>Consent Given</label>
            <input type="text" value={extras.Consent ? "Yes" : "No"} readOnly />
          </div>
        </div>
      </section>

      <button
        className="extras-save-btn"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Saving...
          </>
        ) : (
          <>
            <i className="fas fa-save"></i> Save Changes
          </>
        )}
      </button>
    </div>
  );
};

export default ExtrasTab;

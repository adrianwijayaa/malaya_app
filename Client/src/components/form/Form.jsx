import React, { useState, useEffect } from "react";
import "./Form.css";

const Form = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const initialFormData = {
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "",

    // Travel Details
    destinations: [],
    startDate: "",
    isFlexible: "No",
    duration: "",
    adults: 1,
    numberOfChildren: 0,
    children: [],

    // Accommodation
    accommodationType: "",
    roomType: "",
    accommodationRequests: "",

    // Activities
    activities: [],
    activityLevel: "",
    specialInterests: "",

    // Transportation
    needsInternationalFlight: "No",
    departureCity: "",
    needsDomesticFlight: "No",
    domesticDepartureCity: "", // Add this new property
    transportType: "",

    // Meals
    dietaryRestrictions: [],
    mealPlan: "",
    foodRequests: "",

    // Special Requests
    occasion: "",
    additionalServices: [],
    specialRequests: "",

    // Budget
    budget: "",
    currency: "USD - US Dollar", // Default value",

    // Source
    heardFrom: "",
    agreeToTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Add new state for validation
  const [isStepValid, setIsStepValid] = useState(false);

  // Add validation function
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return !!(
          formData.fullName &&
          formData.email &&
          formData.preferredContact
        );
      case 2:
        return !!(
          formData.destinations.length &&
          formData.startDate &&
          formData.duration &&
          formData.adults
        );
      case 3:
        return !!(formData.accommodationType && formData.roomType);
      case 4:
        return !!(formData.activities.length && formData.activityLevel);
      case 5:
        return !!(
          formData.needsInternationalFlight !== undefined &&
          formData.needsDomesticFlight !== undefined &&
          formData.transportType &&
          (formData.needsInternationalFlight === "No" ||
            formData.departureCity) &&
          (formData.needsDomesticFlight === "No" ||
            formData.domesticDepartureCity)
        );
      case 6:
        return !!(formData.mealPlan && formData.dietaryRestrictions.length);
      case 7:
        return true; // Special requests are optional
      case 8:
        return !!(formData.currency && formData.budget);
      case 9:
        return !!(formData.heardFrom && formData.agreeToTerms);
      default:
        return false;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  // Update handleNext to include validation
  const handleNext = () => {
    if (currentStep < 9 && validateStep(currentStep)) {
      setCurrentStep((curr) => curr + 1);
      // Add scroll to top
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((curr) => curr - 1);
      // Add scroll to top
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }
  };

  // Check validation on form data changes
  useEffect(() => {
    setIsStepValid(validateStep(currentStep));
  }, [formData, currentStep]);

  const renderFormSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-user"></i>
              Personal Information
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Contact Method *</label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="Email"
                      checked={formData.preferredContact === "Email"}
                      onChange={handleChange}
                      required
                    />
                    <span>Email</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="Phone"
                      checked={formData.preferredContact === "Phone"}
                      onChange={handleChange}
                    />
                    <span>Phone</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="WhatsApp"
                      checked={formData.preferredContact === "WhatsApp"}
                      onChange={handleChange}
                    />
                    <span>WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-globe-asia"></i>
              Travel Details
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Preferred Destination(s) *</label>
                <div className="checkbox-group">
                  {[
                    "Bali",
                    "Jakarta",
                    "Yogyakarta",
                    "Lombok",
                    "Labuan Bajo",
                    "Raja Ampat",
                    "Lake Toba",
                    "Bandung",
                  ].map((dest) => (
                    <label key={dest} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.destinations.includes(dest)}
                        onChange={() => handleMultiSelect("destinations", dest)}
                      />
                      <span>{dest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Are your dates flexible? *</label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="isFlexible"
                      value="Yes"
                      checked={formData.isFlexible === "Yes"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFlexible: e.target.value,
                        }))
                      }
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="isFlexible"
                      value="No"
                      checked={formData.isFlexible === "No"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFlexible: e.target.value,
                        }))
                      }
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Trip Duration (days) *</label>
                <input
                  type="number"
                  name="duration"
                  className="form-input"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  required
                  placeholder="Enter number of days"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Adults *</label>
                <input
                  type="number"
                  name="adults"
                  className="form-input"
                  value={formData.adults}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="Enter number of adults"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Number of Children (under 12)
                </label>
                <input
                  type="number"
                  name="numberOfChildren"
                  className="form-input"
                  value={formData.numberOfChildren}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const maxChildren = 5; // Maximum number of children allowed
                    const numberOfChildren = Math.min(
                      Math.max(0, value),
                      maxChildren
                    );

                    // Update number of children and resize children array accordingly
                    setFormData((prev) => ({
                      ...prev,
                      numberOfChildren,
                      children:
                        numberOfChildren < prev.children.length
                          ? prev.children.slice(0, numberOfChildren)
                          : [
                              ...prev.children,
                              ...Array(
                                numberOfChildren - prev.children.length
                              ).fill(""),
                            ],
                    }));
                  }}
                  min="0"
                  max="5"
                  placeholder="Enter number of children"
                />
              </div>

              {formData.numberOfChildren > 0 && (
                <div className="form-group full-width">
                  <label className="form-label">Children's Ages</label>
                  <div className="nested-input">
                    {[...Array(formData.numberOfChildren)].map((_, index) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <label
                          className="form-label"
                          style={{ fontSize: "0.9em" }}
                        >
                          Child {index + 1} Age
                        </label>
                        <input
                          type="number"
                          className="form-input"
                          value={formData.children[index] || ""}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              children: newChildren,
                            }));
                          }}
                          min="0"
                          max="11"
                          required
                          placeholder="Enter age (0-11)"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-hotel"></i>
              Accommodation Preferences
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Preferred Accommodation Type *
                </label>
                <select
                  name="accommodationType"
                  className="form-select"
                  value={formData.accommodationType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select accommodation type</option>
                  <option value="Luxury Resort">Luxury Resort</option>
                  <option value="Boutique Hotel">Boutique Hotel</option>
                  <option value="Private Villa">Private Villa</option>
                  <option value="Guest House">Guesthouse</option>
                  <option value="Eco Lodge">Eco Lodge</option>
                  <option value="Glamping">Glamping</option>
                  <option value="Traditional">Traditional Stay</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Room Type *</label>
                <select
                  name="roomType"
                  className="form-select"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select room type</option>
                  <option value="Standard Room">Standard Room</option>
                  <option value="Deluxe Room">Deluxe Room</option>
                  <option value="Suite">Suite</option>
                  <option value="Family Room">Family Room</option>
                  <option value="Pool Villa">Pool Villa</option>
                  <option value="Ocean View Room">Ocean View Room</option>
                  <option value="Garden View Room">Garden View Room</option>
                  <option value="Connecting Rooms">Connecting Rooms</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Special Accommodation Requests
                </label>
                <textarea
                  name="accommodationRequests"
                  className="form-textarea"
                  value={formData.accommodationRequests}
                  onChange={handleChange}
                  placeholder="Please specify any special requirements (e.g., accessibility needs, adjoining rooms, specific floor preferences, etc.)"
                  rows="4"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-hiking"></i>
              Activities & Interests
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Preferred Activities *</label>
                <div className="checkbox-group">
                  {[
                    "Beach & Water Sports",
                    "Cultural Tours",
                    "Hiking & Trekking",
                    "Diving & Snorkeling",
                    "Culinary Experiences",
                    "Spa & Wellness",
                    "Photography Tours",
                    "Wildlife Watching",
                    "Temple Visits",
                    "Surfing",
                    "Yoga & Meditation",
                    "Local Markets",
                    "Cooking Classes",
                    "Island Hopping",
                    "Waterfall Tours",
                  ].map((activity) => (
                    <label key={activity} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.activities.includes(activity)}
                        onChange={() =>
                          handleMultiSelect("activities", activity)
                        }
                      />
                      <span>{activity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Level *</label>
                <select
                  name="activityLevel"
                  className="form-select"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select activity level</option>
                  <option value="Relaxed (Minimal physical activity)">
                    Relaxed (Minimal physical activity)
                  </option>
                  <option value="Moderate (Some Walking, Light Activities)">
                    Moderate (Some walking, light activities)
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

              <div className="form-group full-width">
                <label className="form-label">
                  Special Interests or Themes
                </label>
                <textarea
                  name="specialInterests"
                  className="form-textarea"
                  value={formData.specialInterests}
                  onChange={handleChange}
                  placeholder="Tell us about any specific interests or themes you'd like to incorporate into your trip (e.g., photography, architecture, local crafts, spiritual experiences, etc.)"
                  rows="4"
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-plane"></i>
              Transportation Preferences
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Need International Flight? *
                </label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="needsInternationalFlight"
                      value="Yes"
                      checked={formData.needsInternationalFlight === "Yes"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          needsInternationalFlight: e.target.value,
                        }))
                      }
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="needsInternationalFlight"
                      value="No"
                      checked={formData.needsInternationalFlight === "No"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          needsInternationalFlight: e.target.value,
                        }))
                      }
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {formData.needsInternationalFlight === "Yes" && (
                <div className="form-group">
                  <label className="form-label">Departure City *</label>
                  <input
                    type="text"
                    name="departureCity"
                    className="form-input"
                    value={formData.departureCity}
                    onChange={handleChange}
                    placeholder="Enter your departure city"
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Need Domestic Flight? *</label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="needsDomesticFlight"
                      value="Yes"
                      checked={formData.needsDomesticFlight === "Yes"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          needsDomesticFlight: e.target.value,
                        }))
                      }
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="needsDomesticFlight"
                      value="No"
                      checked={formData.needsDomesticFlight === "No"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          needsDomesticFlight: e.target.value,
                        }))
                      }
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {formData.needsDomesticFlight === "Yes" && (
                <div className="form-group">
                  <label className="form-label">
                    Domestic Departure City *
                  </label>
                  <input
                    type="text"
                    name="domesticDepartureCity"
                    className="form-input"
                    value={formData.domesticDepartureCity}
                    onChange={handleChange}
                    placeholder="Enter your domestic departure city"
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Preferred Transport Type *</label>
                <select
                  name="transportType"
                  className="form-select"
                  value={formData.transportType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select transport type</option>
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
                  <option value="Mixed Transportation">
                    Mixed Transportation
                  </option>
                </select>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-utensils"></i>
              Meal Preferences
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Dietary Restrictions *</label>
                <div className="checkbox-group">
                  {[
                    "Vegetarian",
                    "Vegan",
                    "Gluten-Free",
                    "Dairy-Free",
                    "Halal",
                    "Kosher",
                    "Nut Allergy",
                    "Seafood Allergy",
                    "No Pork",
                    "No Beef",
                    "Low-Sodium",
                    "Diabetic-Friendly",
                  ].map((diet) => (
                    <label key={diet} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.dietaryRestrictions.includes(diet)}
                        onChange={() =>
                          handleMultiSelect("dietaryRestrictions", diet)
                        }
                        required
                      />
                      <span>{diet}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meal Plan Preference *</label>
                <select
                  name="mealPlan"
                  className="form-select"
                  value={formData.mealPlan}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select meal plan</option>
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

              <div className="form-group full-width">
                <label className="form-label">Special Food Requests</label>
                <textarea
                  name="foodRequests"
                  className="form-textarea"
                  value={formData.foodRequests}
                  onChange={handleChange}
                  placeholder="Please specify any food allergies, intolerances, or special dietary requirements we should be aware of. Include any specific preferences or restrictions not covered above."
                  rows="4"
                />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-gift"></i>
              Special Requests
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Special Occasion</label>
                <select
                  name="occasion"
                  className="form-select"
                  value={formData.occasion}
                  onChange={handleChange}
                >
                  <option value="">Select occasion (if any)</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="birthday">Birthday</option>
                  <option value="graduation">Graduation</option>
                  <option value="wedding">Wedding</option>
                  <option value="proposal">Proposal</option>
                  <option value="babymoon">Babymoon</option>
                  <option value="retirement">Retirement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Additional Services</label>
                <div className="checkbox-group">
                  {[
                    "Airport Transfer",
                    "Photography Service",
                    "Special Decoration",
                    "Private Tour Guide",
                    "Spa & Massage",
                    "Special Event Planning",
                    "Language Interpreter",
                    "Child Care Service",
                    "Travel Insurance",
                    "Visa Assistance",
                    "Equipment Rental",
                    "Personal Shopper",
                  ].map((service) => (
                    <label key={service} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.additionalServices.includes(service)}
                        onChange={() =>
                          handleMultiSelect("additionalServices", service)
                        }
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Special Requests & Notes</label>
                <textarea
                  name="specialRequests"
                  className="form-textarea"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Please share any additional requests, preferences, or special arrangements you'd like us to consider. Include any specific details about celebrations or particular needs we should be aware of."
                  rows="5"
                />
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-wallet"></i>
              Budget Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Estimated Budget per Person *
                </label>
                <input
                  type="number"
                  name="budget"
                  className="form-input"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter your budget per person"
                  min="0"
                  step="100"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Currency *</label>
                <select
                  name="currency"
                  className="form-select"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                >
                  <option value="USD - US Dollar">USD - US Dollar</option>
                  <option value="EUR - Euro">EUR - Euro</option>
                  <option value="GBP - British Pound">
                    GBP - British Pound
                  </option>
                  <option value="AUD - Australian Dollar">
                    AUD - Australian Dollar
                  </option>
                  <option value="SGD - Singapore Dollar">
                    SGD - Singapore Dollar
                  </option>
                  <option value="JPY - Japanese Yen">JPY - Japanese Yen</option>
                  <option value="IDR - Indonesian Rupiah">
                    IDR - Indonesian Rupiah
                  </option>
                  <option value="MYR - Malaysian Ringgit">
                    MYR - Malaysian Ringgit
                  </option>
                  <option value="CNY - Chinese Yuan">CNY - Chinese Yuan</option>
                </select>
              </div>

              <div className="form-group full-width">
                <p
                  className="form-note"
                  style={{ marginTop: "10px", color: "#666" }}
                >
                  Note: The budget helps us tailor recommendations to your
                  preferences. We offer options across various price ranges and
                  can adjust proposals to match your comfort level.
                </p>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-paper-plane"></i>
              Final Steps
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  How did you hear about us? *
                </label>
                <select
                  name="heardFrom"
                  className="form-select"
                  value={formData.heardFrom}
                  onChange={handleChange}
                  required
                >
                  <option value="">Please select</option>
                  <option value="GOOGLE_SEARCH">Google Search</option>
                  <option value="SOCIAL_MEDIA">Social Media</option>
                  <option value="FRIEND_FAMILY">
                    Friend/Family Recommendation
                  </option>
                  <option value="TRAVEL_BLOG">Travel Blog/Website</option>
                  <option value="PREVIOUS_CUSTOMER">Previous Customer</option>
                  <option value="TRAVEL_AGENT">Travel Agent</option>
                  <option value="ADVERTISEMENT">Advertisement</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <div style={{ marginTop: "20px" }}>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                    />
                    <span>
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        style={{
                          color: "#35b7b3",
                          textDecoration: "underline",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms and Conditions
                      </a>{" "}
                      and acknowledge the{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        style={{
                          color: "#35b7b3",
                          textDecoration: "underline",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </a>
                      . *
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <p
                  className="form-note"
                  style={{ marginTop: "20px", color: "#666" }}
                >
                  By submitting this form, you'll receive a confirmation email
                  with your inquiry details. Our travel expert will contact you
                  within 24 hours to discuss your travel plans.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const submitFormSection = async (endpoint, data) => {
    try {
      console.log(`Submitting to ${endpoint}:`, data); // Debug log
      const response = await fetch(`http://localhost:3000/api/v1/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Server error for ${endpoint}:`, errorData); // Debug log
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log(`Success response from ${endpoint}:`, result); // Debug log
      return result;
    } catch (error) {
      console.error(`Error submitting to ${endpoint}:`, error);
      throw error;
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format data to match server expectations
      const personalInfo = await submitFormSection("personal-info", {
        fullname: formData.fullName, // Changed from fullName to name
        email: formData.email,
        phonenumber: formData.phone, // Changed from phone to phoneNumber
        preferedcontactmethod: formData.preferredContact, // Changed from preferredContact to contactMethod
      });

      console.log(personalInfo);

      const personalID = personalInfo.id;

      const travelDetails = await submitFormSection("travel-detail", {
        personalID: personalID, // Use the ID from personalInfo response
        preferredDestinations: formData.destinations.join(", "), // Convert array to string
        preferredStartDate: formData.startDate,
        flexibleDates: formData.isFlexible, // Will now send "Yes" or "No"
        tripDurationDays: parseInt(formData.duration), // Ensure number
        adults: parseInt(formData.adults), // Ensure number
        children: formData.numberOfChildren.toString(), // Convert to string
        childrenAges: formData.children.length
          ? formData.children.join(", ")
          : "0",
      });

      console.log(travelDetails);

      const travelID = travelDetails.data.id;
      const accommodation = await submitFormSection(
        "accommodation-prefference",
        {
          travelDetailId: travelID, // Use the ID from travelDetails response
          preferredAccommodationType: formData.accommodationType, // Changed from accommodationType to type
          roomType: formData.roomType, // Changed from roomType to roomPreference
          specialAccommodationRequests: formData.accommodationRequests, // Changed from accommodationRequests to specialRequests
        }
      );

      const activities = await submitFormSection("activity-interest", {
        travelDetailsId: travelID, // Use the ID from travelDetails response
        prefferedActivities: formData.activities.join(", "), // Convert array to string
        activityLevel: formData.activityLevel,
        specialInterest: formData.specialInterests,
      });

      const transportation = await submitFormSection(
        "transportation-prefference",
        {
          travelDetailsID: travelID, // Use the ID from travelDetails response
          internationalFlightRequired: formData.needsInternationalFlight,
          departureCity: formData.departureCity,
          domesticFlightRequired: formData.needsDomesticFlight,
          domesticDepartureCity: formData.domesticDepartureCity,
          prefferedTransportType: formData.transportType, // Changed from transportType to transportationType
        }
      );

      const meals = await submitFormSection("meal-prefference", {
        travelDetailsID: travelID, // Use the ID from travelDetails response
        dietaryRestrictions: formData.dietaryRestrictions.join(", "), // Convert array to string
        mealPlanPreferences: formData.mealPlan, // Changed from mealPlan to mealPlanType
        specialFoodRequests: formData.foodRequests, // Changed from foodRequests to specialRequests
      });

      const specialRequests = await submitFormSection("special-request", {
        travelDetailsID: travelID, // Use the ID from travelDetails response
        occasionsToCelebrate: formData.occasion, // Changed from occasion to occasionType
        additionalServicesNeeded: formData.additionalServices.join(", "), // Convert array to string
        specialRequestsNotes: formData.specialRequests, // Changed from specialRequests to additionalNotes
      });

      const budget = await submitFormSection("budget", {
        travelDetailsID: travelID, // Use the ID from travelDetails response
        estimatedBudgetPerPerson: parseFloat(formData.budget), // Ensure number
        currency: formData.currency,
      });

      // Final submission
      await submitFormSection("submission", {
        personalID: personalInfo.id,
        howDidYouHear: formData.heardFrom, // Now using the enum values
        consent: formData.agreeToTerms, // Changed from agreeToTerms to consentToPrivacyPolicys
      });

      setShowSuccessPopup(true);
      resetForm();

      // Close form immediately after successful submission
      onClose();

      // Hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    } catch (error) {
      alert("There was an error submitting your form. Please try again.");
      console.error("Form submission error:", error);
    }
  };

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`modal-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-modal" onClick={onClose}>
            ×
          </button>

          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Plan Your Dream Trip</h2>
              <p className="form-subtitle">
                Tell us about your perfect Indonesian adventure
              </p>
              <div className="progress-bar">
                <div className="progress-steps">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
                    <div
                      key={step}
                      className={`step ${
                        currentStep === step ? "active" : ""
                      } ${currentStep > step ? "completed" : ""}`}
                    >
                      <div className="step-number">{step}</div>
                      <div className="step-label">
                        {step === 1 && "Personal"}
                        {step === 2 && "Travel"}
                        {step === 3 && "Accommodation"}
                        {step === 4 && "Activities"}
                        {step === 5 && "Transport"}
                        {step === 6 && "Meals"}
                        {step === 7 && "Special"}
                        {step === 8 && "Budget"}
                        {step === 9 && "Final"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {renderFormSection()}

              <div className="form-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="prev-btn"
                    onClick={handlePrev}
                  >
                    Previous
                  </button>
                )}
                {currentStep < 9 ? (
                  <button
                    type="button"
                    className={`next-btn ${!isStepValid ? "disabled" : ""}`}
                    onClick={handleNext}
                    disabled={!isStepValid}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`submit-btn ${!isStepValid ? "disabled" : ""}`}
                    disabled={!isStepValid}
                  >
                    Submit Booking Request
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Success!</h3>
            <p>Your booking request has been submitted successfully!</p>
            <p>
              We'll contact you within 24 hours to discuss your travel plans.
            </p>
            <button onClick={() => setShowSuccessPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;

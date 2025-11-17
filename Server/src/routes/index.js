"use strict";

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/jwtMiddleware.js");
const upload = require("../middlewares/uploadMiddleware.js");

// ========== CONTROLLERS ==========
const { register, login } = require("../controllers/auth-Controller.js");
const uploadController = require("../controllers/upload-controller.js");
const newsC = require("../controllers/news-controller.js");

// Forms
const personalInfoC = require("../controllers/personalInformation-controller.js");
const travelDetailsC = require("../controllers/travelDetail-controller.js");
const accommodationC = require("../controllers/accomodation-controller.js");
const activityC = require("../controllers/activityInterest-controller.js");
const transportationC = require("../controllers/transportasion-controller.js");
const mealPrefferenceC = require("../controllers/mealPrefference-controller.js");
const specialRequestC = require("../controllers/specialRequest-controller.js");
const budgetC = require("../controllers/budget-controller.js");
const submissionC = require("../controllers/submission-controller.js");

// Tailor Made Trip
const tailorTripC = require("../controllers/tailorDetailControllers/trip-controller.js");
const tailorTripHighlightC = require("../controllers/tailorDetailControllers/tripHighlight-controller.js");
const tailorTripIncludeC = require("../controllers/tailorDetailControllers/tripInclude-controller.js");
const tailorTripExcludeC = require("../controllers/tailorDetailControllers/tripExclude-controller.js");
const tailorTripFactC = require("../controllers/tailorDetailControllers/tripFact-controller.js");
const tailorTripPriceDetailC = require("../controllers/tailorDetailControllers/tripPriceDetail-controller.js");

// Join de Trip
const joinTripC = require("../controllers/joinDeTripControllers/joinTrip-controller.js");
const joinTripHighlightC = require("../controllers/joinDeTripControllers/joinTripHighlight-controller.js");
const joinTripIncludeC = require("../controllers/joinDeTripControllers/joinTripInclude-controller.js");
const joinTripExcludeC = require("../controllers/joinDeTripControllers/joinTripExclude-controller.js");
const joinTripPriceDetailC = require("../controllers/joinDeTripControllers/joinTripPriceDetail-controller.js");

// ========================================
// ========== PUBLIC ROUTES ==============
// ========================================

router.post("/register", register);
router.post("/login", login);

// News (Public)
router.get("/news", newsC.getAllNews);
router.get("/news/:id", newsC.getNewsById);
router.get("/news/slug/:slug", newsC.getNewsBySlug);

// Tailor Made Trip (Public)
router.get("/tailor-trips", tailorTripC.getAllTrips);
router.get("/tailor-trip/:id", tailorTripC.getTripById);
router.get("/tailor-trip-highlights", tailorTripHighlightC.getAllHighlights);
router.get("/tailor-trip-highlight/:id", tailorTripHighlightC.getHighlightById);
router.get("/tailor-trip-includes", tailorTripIncludeC.getAllIncludes);
router.get("/tailor-trip-include/:id", tailorTripIncludeC.getIncludeById);
router.get("/tailor-trip-excludes", tailorTripExcludeC.getAllExcludes);
router.get("/tailor-trip-exclude/:id", tailorTripExcludeC.getExcludeById);
router.get("/tailor-trip-facts", tailorTripFactC.getAllFacts);
router.get("/tailor-trip-fact/:id", tailorTripFactC.getFactById);
router.get(
  "/tailor-trip-price-details",
  tailorTripPriceDetailC.getAllPriceDetails
);
router.get(
  "/tailor-trip-price-detail/:id",
  tailorTripPriceDetailC.getPriceDetailById
);

// Join de Trip (Public)
router.get("/join-trips", joinTripC.getAllJoinTrips);
router.get("/join-trip/:id", joinTripC.getJoinTripById);
router.get(
  "/join-trip-highlights",
  joinTripHighlightC.getAllJoinTripHighlights
);
router.get(
  "/join-trip-highlight/:id",
  joinTripHighlightC.getJoinTripHighlightById
);
router.get("/join-trip-includes", joinTripIncludeC.getAllJoinTripIncludes);
router.get("/join-trip-include/:id", joinTripIncludeC.getJoinTripIncludeById);
router.get("/join-trip-excludes", joinTripExcludeC.getAllExcludes);
router.get("/join-trip-exclude/:id", joinTripExcludeC.getExcludeById);
router.get("/join-trip-price-details", joinTripPriceDetailC.getAllPriceDetails);
router.get(
  "/join-trip-price-detail/:id",
  joinTripPriceDetailC.getPriceDetailById
);

// ========================================
// ========== PROTECTED ROUTES ===========
// ========================================
router.use(authenticateToken);

router.post(
  "/upload-image",
  upload.single("image"),
  uploadController.uploadImage
);

// Form Submissions
router.post("/personal-info", personalInfoC.createPersonalInformation);
router.post("/travel-detail", travelDetailsC.createTravelDetail);
router.post("/accommodation-prefference", accommodationC.createAccomodation);
router.post("/activity-interest", activityC.createActivity);
router.post(
  "/transportation-prefference",
  transportationC.createTransportation
);
router.post("/meal-prefference", mealPrefferenceC.createMeal);
router.post("/special-request", specialRequestC.createSpecialRequest);
router.post("/budget", budgetC.createBudget);
router.post("/submission", submissionC.createSubmission);

// News (Admin)
router.post("/news", newsC.createNews);
router.put("/news/:id", newsC.updateNews);
router.delete("/news/:id", newsC.deleteNews);

// Tailor Made Trip (Admin)
router.post("/tailor-trip", tailorTripC.createTrip);
router.put("/tailor-trip/:id", tailorTripC.updateTrip);
router.delete("/tailor-trip/:id", tailorTripC.deleteTrip);

router.post("/tailor-trip-highlight", tailorTripHighlightC.createHighlight);
router.put("/tailor-trip-highlight/:id", tailorTripHighlightC.updateHighlight);
router.delete(
  "/tailor-trip-highlight/:id",
  tailorTripHighlightC.deleteHighlight
);

router.post("/tailor-trip-include", tailorTripIncludeC.createInclude);
router.put("/tailor-trip-include/:id", tailorTripIncludeC.updateInclude);
router.delete("/tailor-trip-include/:id", tailorTripIncludeC.deleteInclude);

router.post("/tailor-trip-exclude", tailorTripExcludeC.createExclude);
router.put("/tailor-trip-exclude/:id", tailorTripExcludeC.updateExclude);
router.delete("/tailor-trip-exclude/:id", tailorTripExcludeC.deleteExclude);

router.post("/tailor-trip-fact", tailorTripFactC.createFact);
router.put("/tailor-trip-fact/:id", tailorTripFactC.updateFact);
router.delete("/tailor-trip-fact/:id", tailorTripFactC.deleteFact);

router.post(
  "/tailor-trip-price-detail",
  tailorTripPriceDetailC.createPriceDetail
);
router.put(
  "/tailor-trip-price-detail/:id",
  tailorTripPriceDetailC.updatePriceDetail
);
router.delete(
  "/tailor-trip-price-detail/:id",
  tailorTripPriceDetailC.deletePriceDetail
);

// Join de Trip (Admin)
router.post("/join-trip", joinTripC.createJoinTrip);
router.put("/join-trip/:id", joinTripC.updateJoinTrip);
router.delete("/join-trip/:id", joinTripC.deleteJoinTrip);

router.post("/join-trip-highlight", joinTripHighlightC.createJoinTripHighlight);
router.put(
  "/join-trip-highlight/:id",
  joinTripHighlightC.updateJoinTripHighlight
);
router.delete(
  "/join-trip-highlight/:id",
  joinTripHighlightC.deleteJoinTripHighlight
);

router.post("/join-trip-include", joinTripIncludeC.createJoinTripInclude);
router.put("/join-trip-include/:id", joinTripIncludeC.updateJoinTripInclude);
router.delete("/join-trip-include/:id", joinTripIncludeC.deleteJoinTripInclude);

router.post("/join-trip-exclude", joinTripExcludeC.createExclude);
router.put("/join-trip-exclude/:id", joinTripExcludeC.updateExclude);
router.delete("/join-trip-exclude/:id", joinTripExcludeC.deleteExclude);

router.post("/join-trip-price-detail", joinTripPriceDetailC.createPriceDetail);
router.put(
  "/join-trip-price-detail/:id",
  joinTripPriceDetailC.updatePriceDetail
);
router.delete(
  "/join-trip-price-detail/:id",
  joinTripPriceDetailC.deletePriceDetail
);

module.exports = router;

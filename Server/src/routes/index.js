const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/jwtMiddleware.js");

const { register, login } = require("../controllers/auth-Controller.js");
const upload = require("../middlewares/uploadMiddleware.js");
const uploadController = require("../controllers/upload-controller.js");
const newsC = require("../controllers/news-controller.js");
//const basicAuth = require("../middlewares/basicAuthMiddleware.js");

// forms
const personalInfoC = require("../controllers/personalInformation-controller.js");
const travelDetailsC = require("../controllers/travelDetail-controller.js");
const accommodationC = require("../controllers/accomodation-controller.js");
const activityC = require("../controllers/activityInterest-controller.js");
const transportationC = require("../controllers/transportasion-controller.js");
const mealPrefferenceC = require("../controllers/mealPrefference-controller.js");
const specialRequestC = require("../controllers/specialRequest-controller.js");
const budgetC = require("../controllers/budget-controller.js");
const submissionC = require("../controllers/submission-controller.js");

// tailorMade
const tailorTripC = require("../controllers/tailorDetailControllers/trip-controller.js");
const tailorTripHighlightC = require("../controllers/tailorDetailControllers/tripHighlight-controller.js");
const tailorTripIncludeC = require("../controllers/tailorDetailControllers/tripInclude-controller.js");
const tailorTripFactC = require("../controllers/tailorDetailControllers/tripFact-controller.js");

// joinDeTrip
const joinTripC = require("../controllers/joinDeTripControllers/joinTrip-controller.js");
const joinTripHighlightC = require("../controllers/joinDeTripControllers/joinTripHighlight-controller.js");
const joinTripIncludeC = require("../controllers/joinDeTripControllers/joinTripInclude-controller.js");

router.post("/register", register);
router.post("/login", login);

// Forms
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

// Tailor Trip
router.post("/tailor-trip", tailorTripC.createTrip);
router.post("/tailor-trip-highlight", tailorTripHighlightC.createHighlight);
router.post("/tailor-trip-include", tailorTripIncludeC.createInclude);
router.post("/tailor-trip-fact", tailorTripFactC.createFact);

// Join Trip
router.post("/join-trip", joinTripC.createJoinTrip);
router.post("/join-trip-highlight", joinTripHighlightC.createJoinTripHighlight);
router.post("/join-trip-include", joinTripIncludeC.createJoinTripInclude);

// (public)
router.get("/news", newsC.getAllNews);
router.get("/news/:id", newsC.getNewsById);
router.get("/news/slug/:slug", newsC.getNewsBySlug);
router.get("/tailor-trips", tailorTripC.getAllTrips);
router.get("/tailor-trip/:id", tailorTripC.getTripById);
router.get("/tailor-trip-highlights", tailorTripHighlightC.getAllHighlights);
router.get("/tailor-trip-highlight/:id", tailorTripHighlightC.getHighlightById);
router.get("/tailor-trip-includes", tailorTripIncludeC.getAllIncludes);
router.get("/tailor-trip-include/:id", tailorTripIncludeC.getIncludeById);
router.get("/tailor-trip-facts", tailorTripFactC.getAllFacts);
router.get("/tailor-trip-fact/:id", tailorTripFactC.getFactById);
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

router.use(authenticateToken);

// News (protected)
router.post("/news", newsC.createNews);
router.put("/news/:id", newsC.updateNews);
router.delete("/news/:id", newsC.deleteNews);

// Forms
router.get("/personal-infos", personalInfoC.getAllPersonalInformation);
router.get("/personal-info/:id", personalInfoC.getPersonalInformationbyId);
router.put("/personal-info/:id", personalInfoC.updatePersonalInformation);
router.delete("/personal-info/:id", personalInfoC.deletePersonalInformation);

router.get("/travel-details", travelDetailsC.getAllTravelDetail);
router.get("/travel-detail/:id", travelDetailsC.getTravelDetailById);
router.put("/travel-detail/:id", travelDetailsC.updateTravelDetail);
router.delete("/travel-detail/:id", travelDetailsC.deleteTravelDetail);

router.get("/accommodation-prefferences", accommodationC.getAllAccomodation);
router.get(
  "/accommodation-prefference/:id",
  accommodationC.getAccomodationById
);
router.put("/accommodation-prefference/:id", accommodationC.updateAccomodation);
router.delete(
  "/accommodation-prefference/:id",
  accommodationC.deleteAccomodation
);

router.get("/activity-interests", activityC.getAllActivities);
router.get("/activity-interest/:id", activityC.getActivityById);
router.put("/activity-interest/:id", activityC.updateActivity);
router.delete("/activity-interest/:id", activityC.deleteActivity);

router.get(
  "/transportation-prefferences",
  transportationC.getAllTransportation
);
router.get(
  "/transportation-prefference/:id",
  transportationC.getTransportationById
);
router.put(
  "/transportation-prefference/:id",
  transportationC.updateTransportation
);
router.delete(
  "/transportation-prefference/:id",
  transportationC.deleteTransportation
);

router.get("/meal-prefferences", mealPrefferenceC.getAllMeal);
router.get("/meal-prefference/:id", mealPrefferenceC.getMealById);
router.put("/meal-prefference/:id", mealPrefferenceC.updateMeal);
router.delete("/meal-prefference/:id", mealPrefferenceC.deleteMeal);

router.get("/special-requests", specialRequestC.getAllSpecialRequest);
router.get("/special-request/:id", specialRequestC.getSpecialRequestById);
router.put("/special-request/:id", specialRequestC.updateSpecialRequest);
router.delete("/special-request/:id", specialRequestC.deleteSpecialRequest);

router.get("/budgets", budgetC.getAllBudget);
router.get("/budget/:id", budgetC.getBudgetById);
router.put("/budget/:id", budgetC.updateBudget);
router.delete("/budget/:id", budgetC.deleteBudget);

router.get("/submissions", submissionC.getAllSubmission);
router.get("/submission/:id", submissionC.getSubmissionById);
router.put("/submission/:id", submissionC.updateSubmission);
router.delete("/submission/:id", submissionC.deleteSubmission);

// Tailor Trip
router.put("/tailor-trip/:id", tailorTripC.updateTrip);
router.delete("/tailor-trip/:id", tailorTripC.deleteTrip);

router.put("/tailor-trip-highlight/:id", tailorTripHighlightC.updateHighlight);
router.delete(
  "/tailor-trip-highlight/:id",
  tailorTripHighlightC.deleteHighlight
);

router.put("/tailor-trip-include/:id", tailorTripIncludeC.updateInclude);
router.delete("/tailor-trip-include/:id", tailorTripIncludeC.deleteInclude);

router.put("/tailor-trip-fact/:id", tailorTripFactC.updateFact);
router.delete("/tailor-trip-fact/:id", tailorTripFactC.deleteFact);

// Join Trip
router.put("/join-trip/:id", joinTripC.updateJoinTrip);
router.delete("/join-trip/:id", joinTripC.deleteJoinTrip);

router.put(
  "/join-trip-highlight/:id",
  joinTripHighlightC.updateJoinTripHighlight
);
router.delete(
  "/join-trip-highlight/:id",
  joinTripHighlightC.deleteJoinTripHighlight
);

router.put("/join-trip-include/:id", joinTripIncludeC.updateJoinTripInclude);
router.delete("/join-trip-include/:id", joinTripIncludeC.deleteJoinTripInclude);

router.post(
  "/upload-image",
  upload.single("image"),
  uploadController.uploadImage
);

module.exports = router;

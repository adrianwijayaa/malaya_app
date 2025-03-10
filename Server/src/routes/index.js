const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/jwtMiddleware.js");

const { register, login } = require('../controllers/auth-Controller.js');
//const basicAuth = require("../middlewares/basicAuthMiddleware.js");

const personalInfoC = require("../controllers/personalInformation-controller.js");
const travelDetailsC = require("../controllers/travelDetail-controller.js");
const accommodationC = require("../controllers/accomodation-controller.js");
const activityC = require("../controllers/activityInterest-controller.js");
const transportationC = require("../controllers/transportasion-controller.js");
const mealPrefferenceC = require("../controllers/mealPrefference-controller.js");
const specialRequestC = require("../controllers/specialRequest-controller.js");
const budgetC = require("../controllers/budget-controller.js");
const submissionC = require("../controllers/submission-controller.js");

router.post('/register', register);
router.post('/login', login);

router.post("/personal-info", personalInfoC.createPersonalInformation);
router.post("/travel-detail", travelDetailsC.createTravelDetail);
router.post("/accommodation-prefference", accommodationC.createAccomodation);
router.post("/activity-interest", activityC.createActivity);
router.post("/transportation-prefference", transportationC.createTransportation);
router.post("/meal-prefference", mealPrefferenceC.createMeal);
router.post("/special-request", specialRequestC.createSpecialRequest);
router.post("/budget", budgetC.createBudget);
router.post("/submission", submissionC.createSubmission);

router.use(authenticateToken);

router.get("/personal-infos",personalInfoC.getAllPersonalInformation);
router.get("/personal-info/:id",personalInfoC.getPersonalInformationbyId);
router.put("/personal-info/:id",personalInfoC.updatePersonalInformation);
router.delete("/personal-info/:id", personalInfoC.deletePersonalInformation);

router.get("/travel-details", travelDetailsC.getAllTravelDetail);
router.get("/travel-detail/:id", travelDetailsC.getTravelDetailById);
router.put("/travel-detail/:id", travelDetailsC.updateTravelDetail);
router.delete("/travel-detail/:id", travelDetailsC.deleteTravelDetail);

router.get("/accommodation-prefferences", accommodationC.getAllAccomodation);
router.get("/accommodation-prefference/:id", accommodationC.getAccomodationById);
router.put("/accommodation-prefference/:id", accommodationC.updateAccomodation);
router.delete("/accommodation-prefference/:id", accommodationC.deleteAccomodation);

router.get("/activity-interests", activityC.getAllActivities);
router.get("/activity-interest/:id", activityC.getActivityById);
router.put("/activity-interest/:id", activityC.updateActivity);
router.delete("/activity-interest/:id", activityC.deleteActivity);

router.get("/transportation-prefferences", transportationC.getAllTransportation);
router.get("/transportation-prefference/:id", transportationC.getTransportationById);
router.put("/transportation-prefference/:id", transportationC.updateTransportation);
router.delete("/transportation-prefference/:id", transportationC.deleteTransportation);

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

module.exports = router;
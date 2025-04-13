const express = require('express');
const { createUser, getAllUser, getUserById, updateUser, deleteUser, getUserByEmail, addCompanyDetails, buySubscription, 
    updateCompanyDetails, getFreeTrialPlan, 
    getUserPlanDetails,
    getCompanyDetailsById,
    tempUpdateSubscriptionDetails} = require('../controllers/userController');

const router = express.Router();

router.post("/", createUser);
router.get("/email", getUserByEmail);
router.put("/", updateUser);
router.delete("/", deleteUser);

router.post("/company", addCompanyDetails);
router.put("/company", updateCompanyDetails);
router.get("/company", getCompanyDetailsById);


router.get("/all", getAllUser); // For internal use only.

router.post("/update-temp-subscription", tempUpdateSubscriptionDetails);
router.post("/subscription", buySubscription);

router.post("/trial-plan", getFreeTrialPlan);
router.get("/plan-details", getUserPlanDetails);

router.get("/", getUserById);

module.exports = router;
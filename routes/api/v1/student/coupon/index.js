const express = require("express");
const router = express.Router();
const couponController = require("../../../../../controller/api/v1/student/coupon");
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.post("/verify", checkToken, couponController.verifyCoupon);
router.post("/referral", checkToken, couponController.verifyReferral);

module.exports = router;

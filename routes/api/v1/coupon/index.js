const express = require("express");
const router = express.Router();
const couponController = require("../../../../controller/api/v1/coupon");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, couponController.getCoupons);
router.get("/:id", checkToken, couponController.getCouponWithID);
router.post("/create", checkToken, couponController.createCoupon);
router.patch("/update", checkToken, couponController.updateCoupon);
router.delete("/:id", checkToken, couponController.deleteCoupon);

module.exports = router;

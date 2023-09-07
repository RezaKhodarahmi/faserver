const express = require("express");
const router = express.Router();
const membershipController = require("../../../../../controller/api/v1/student/membership/");
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.get("/buy/:email", checkToken, membershipController.buyVipMembership);

module.exports = router;

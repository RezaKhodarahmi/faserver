const express = require("express");
const router = express.Router();
const ActiveController = require("../../../../controller/api/v1/activecampaing");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.post("/list", checkToken, ActiveController.getList);

module.exports = router;

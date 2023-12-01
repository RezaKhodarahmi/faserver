const express = require("express");
const router = express.Router();
const stripController = require("../../../../controller/api/v1/stripe");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.post("/", checkToken, stripController.verifyPayment);

module.exports = router;

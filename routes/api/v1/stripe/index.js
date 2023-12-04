const express = require("express");
const router = express.Router();
const stripController = require("../../../../controller/api/v1/stripe");

router.post("/", stripController.verifyPayment);

module.exports = router;

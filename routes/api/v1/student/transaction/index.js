const express = require("express");
const router = express.Router();
const TransactionController = require("../../../../../controller/api/v1/student/transaction");
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.post("/create", checkToken, TransactionController.checkout);
router.post(
  "/create-payment-intent",
  checkToken,
  TransactionController.createPaymentIntent
);
router.post(
  "/confirm-payment",
  checkToken,
  TransactionController.confirmPayment
);
router.post(
  "/partially",
  checkToken,
  TransactionController.handelPartiallyPayment
);
module.exports = router;

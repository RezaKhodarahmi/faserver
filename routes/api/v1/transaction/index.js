const express = require("express");
const router = express.Router();
const TransactionController = require("../../../../controller/api/v1/transaction");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, TransactionController.getTransactions);
router.post("/create", checkToken, TransactionController.creteNewTransaction);
router.patch("/update", checkToken, TransactionController.updateTransaction);
router.get("/:id", checkToken, TransactionController.getTransactionWithId);
router.delete("/:id", checkToken, TransactionController.deleteTransaction);

module.exports = router;

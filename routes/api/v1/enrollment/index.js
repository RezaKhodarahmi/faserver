const express = require("express");
const router = express.Router();
const EnrollmentController = require("../../../../controller/api/v1/enrollment");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, EnrollmentController.getEnrollments);
router.post("/create", checkToken, EnrollmentController.creteNewEnroll);
router.patch("/update", checkToken, EnrollmentController.updateEnroll);
router.get("/:id", checkToken, EnrollmentController.getEnrollWithId);
router.delete("/:id", checkToken, EnrollmentController.deleteEnroll);

module.exports = router;

const express = require("express");
const router = express.Router();
const CoursesController = require("../../../../../controller/api/v1/student/courses");
const { checkToken } = require("../../../../../utils/verifyAccessToken");
router.get("/all", CoursesController.getCourses);
router.get("/:slug", CoursesController.getCourseWithId);
router.post(
  "/enrolled-check",
  checkToken,
  CoursesController.GetCourseCheckEnroll
);
router.post("/cart-item", CoursesController.getCartItem);
router.get("/tests/:slug", checkToken, CoursesController.getTests);
router.post("/enroll", checkToken, CoursesController.checkEnroll);

module.exports = router;

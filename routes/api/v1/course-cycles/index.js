const express = require("express");
const router = express.Router();
const CoursesCycleController = require("../../../../controller/api/v1/course-cycle");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/certificate");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.get("/", checkToken, CoursesCycleController.getCycles);
router.get(
  "/course-cycle/:id",
  checkToken,
  CoursesCycleController.getCourseCycle
);
router.post("/create", checkToken, CoursesCycleController.createCycle);
router.get("/:id", checkToken, CoursesCycleController.getCycleWithId);
router.patch("/update", checkToken, CoursesCycleController.updateCycle);
router.delete("/delete/:id", checkToken, CoursesCycleController.deleteCycle);

module.exports = router;

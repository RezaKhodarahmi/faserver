const express = require("express");
const router = express.Router();
const CoursesController = require("../../../../controller/api/v1/courses");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/courses");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", checkToken, CoursesController.getCourses);
router.post(
  "/create",
  checkToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "introPoster", maxCount: 1 },
  ]),
  CoursesController.createCourse
);
router.get("/:id", checkToken, CoursesController.getCourseWithId);

router.patch(
  "/update",
  checkToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "introPoster", maxCount: 1 },
  ]),
  checkToken,
  CoursesController.updateCourse
);

router.delete("/delete/:id", checkToken, CoursesController.deleteCourse);
router.post(
  "/delete-category",
  checkToken,
  CoursesController.deleteCourseCategory
);

module.exports = router;

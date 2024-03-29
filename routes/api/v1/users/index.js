const express = require("express");
const router = express.Router();
const UserController = require("../../../../controller/api/v1/users");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.get("/", checkToken, UserController.getUsers);
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  UserController.createUser
);
router.get("/:id", checkToken, UserController.getUserWithId);
router.get("/get/email/:email", checkToken, UserController.getUserWithEmail);
router.patch(
  "/update",
  checkToken,
  upload.single("image"),
  UserController.updateUser
);

router.post("/authors", checkToken, UserController.getAuthors);
router.post("/teachers", checkToken, UserController.getTeachers);
router.delete("/delete/:id", checkToken, UserController.deleteUser);
router.post("/import-users", upload.single("file"), UserController.importUsers);

module.exports = router;

const express = require("express");
const router = express.Router();
// const AuthController = require("../../../../../controller/api/v1/student/auth");
const verifyToken = require("../../../../../middlewares/nextauth");

router.get("/session", verifyToken, (req, res) => {
  res.json({ message: "You are accessing a protected route", user: req.user });
});

module.exports = router;

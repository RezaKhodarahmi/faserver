require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("./models");
const path = require("path");
const bodyParser = require("body-parser");

const credentials = require("./middlewares/credentials");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
const PORT = process.env.PORT || 3200;
const cors = require("cors");
app.use("/uploads", express.static("uploads"));
app.use(credentials);
app.use(express.json());
app.use(
  "/",
  express.static(
    path.join(__dirname, "/var/www/fanavaranServer/faserver/public")
  )
);
app.use(bodyParser.raw({ type: "application/json" }));

// CORS middleware configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://idtech.ca",
    "http://dashboard.idtech.ca",
    "http://idtech.ca/dashbaord",
  ],
  credentials: true,
};

// Apply the CORS middleware to all routes
app.use(cors(corsOptions));

//Dashboard routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/stripe-webhook", require("./routes/api/v1/stripe"));
app.use("/api/v1", require("./routes/api/v1/register"));
app.use("/api/v1/users", require("./routes/api/v1/users"));
app.use("/api/v1/courses", require("./routes/api/v1/courses"));
app.use("/api/v1/categories", require("./routes/api/v1/categories"));
app.use("/api/v1/cycles", require("./routes/api/v1/course-cycles"));
app.use("/api/v1/videos", require("./routes/api/v1/video"));
app.use("/api/v1/tests", require("./routes/api/v1/test"));
app.use("/api/v1/questions", require("./routes/api/v1/question"));
app.use("/api/v1/answers", require("./routes/api/v1/answer"));
app.use("/api/v1/posts", require("./routes/api/v1/post"));
app.use("/api/v1/blogcategory", require("./routes/api/v1/blogcategory"));
app.use("/api/v1/blogtags", require("./routes/api/v1/blogtags"));
app.use("/api/v1/auth/refresh", require("./routes/refreshToken"));
app.use("/api/v1/coupon", require("./routes/api/v1/coupon"));
app.use("/api/v1/transaction", require("./routes/api/v1/transaction"));
app.use("/api/v1/webinar", require("./routes/api/v1/webinar"));
app.use("/api/v1/activecampaing", require("./routes/api/v1/activecampaing"));

// student routes
app.use("/api/v1/student", require("./routes/api/v1/student/user"));
app.use("/api/v1/student/courses", require("./routes/api/v1/student/course"));
app.use(
  "/api/v1/student/transaction",
  require("./routes/api/v1/student/transaction")
);
app.use("/api/v1/student/profile", require("./routes/api/v1/student/profile"));
app.use("/api/v1/student/coupon", require("./routes/api/v1/student/coupon"));
app.use("/api/v1/student/tests", require("./routes/api/v1/student/tests"));
app.use(
  "/api/v1/student/membership",
  require("./routes/api/v1/student/membership")
);

// Handle 404 errors
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//Running server
dbConnect.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
  });
});

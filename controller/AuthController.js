const Users = require("../models").Users;
const UserSessions = require("../models").UserSessions;
const bodyValidation = require("../utils/validationSchema");
const { transporter } = require("../config/mailSender");
const TokenGenerator = require("../utils/generateToken.js");
const { checkRole, checkUserRole } = require("../middlewares/roleCheck");
const bcrypt = require("bcrypt");
const geoip = require("geoip-lite");

const getCountryFromIP = (ip) => {
  const geo = geoip.lookup(ip);
  return geo ? geo.country : null;
};
const {
  forgetPassReqEmailTemplate,
} = require("../views/email-template/forgetRequest");

const handelRegister = async (req, res) => {
  try {
    const { email, phone } = req.body;
    //Validate body
    const { err } = bodyValidation.SignUpBodyValidation(req.body);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    //Check if user already exist
    const user = await Users.findOne({ where: { email, phone } });
    if (user) {
      if (user.registerStep === 1) {
        const token = user.token;
        res
          .status(200)
          .json({ message: "Email sent successfully", data: user });
      } else {
        res.status(200).json({
          message:
            "This email address or company already exists! Please log in or ask your company admin to invite you.",
          error: true,
        });
      }
    } else {
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      const user = await Users.create({
        email,
        phone,
        registerStep: 1,
        token,
      });

      res.status(200).json({ message: "Email sent successfully", data: user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const handelLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid Email or Password!",
      });
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword) {
      return res.status(401).json({
        error: true,
        message: "Invalid Email or Password!",
      });
    }

    // Check user role before generating tokens and sending success response
    checkRole(user.role)(req, res, async () => {
      const { accessToken, refreshToken } = await TokenGenerator.GenerateToken(
        user
      );
      // Filter data before send
      const {
        password,
        token,
        forgotToken,
        contract,
        registerStep,
        language,
        timezone,
        createdAt,
        updatedAt,
        stripeCustomerId,
        ...filteredData
      } = user.dataValues;
      res.status(200).json({
        error: false,
        accessToken,
        refreshToken,
        data: filteredData,
        message: "Logged in successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const handelUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentIP = req.ip;
    const currentCountry = getCountryFromIP(currentIP);

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid Email or Password!",
      });
    }

    const activeSession = await UserSessions.findOne({
      where: { userId: user.id },
    });

    if (activeSession && activeSession.country !== currentCountry) {
      return res
        .status(401)
        .send("Simultaneous login from different countries is not allowed.");
    }
    await UserSessions.upsert({
      userId: user.id,
      ip: currentIP,
      country: currentCountry,
      lastActive: new Date(),
    });
    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword) {
      return res.status(401).json({
        error: true,
        message: "Invalid Email or Password!",
      });
    }

    // Check user role before generating tokens and sending success response
    checkUserRole(user.role)(req, res, async () => {
      const { accessToken, refreshToken } = await TokenGenerator.GenerateToken(
        user
      );
      // Filter data before send
      const {
        password,
        token,
        forgotToken,
        contract,
        registerStep,
        language,
        timezone,
        createdAt,
        updatedAt,
        stripeCustomerId,
        ...filteredData
      } = user.dataValues;

      res.status(200).json({
        error: false,
        accessToken,
        refreshToken,
        data: filteredData,
        message: "Logged in successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
// Handle user request for forgot password
const HandleRequestForgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    // Validate request body
    const { error } = bodyValidation.RequestForgetPassBodyValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    // Check if user exists and verify password
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User not found!",
      });
    }

    // Generate tokens and send success response
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await transporter.sendMail({
      from: '"Fanavaran" <no-reply@fanavaran.ca>',
      to: email,
      subject: "Just one more step; Reset password",
      text: "Reset password",
      html: forgetPassReqEmailTemplate(token, email),
    });

    user.forgotToken = token;
    await user.save();
    return res.status(200).json({
      error: false,
      message: "Forgot password link sent successfully.",
    });
  } catch (err) {
    console.log(err);
    // Send error response
    return res.status(500).json({
      err: true,
      message: "Server Error!",
    });
  }
};

// Handle user login
const HandleVerifyForgetPass = async (req, res) => {
  try {
    const { token } = req.body;
    // Validate request body
    const { error } = bodyValidation.VerifyForgetPassBodyValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    // Check if user exists and verify password
    const user = await Users.findOne({
      where: { forgotToken: token },
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid Token",
      });
    }
    // Filter data before send
    const {
      password,
      forgotToken,
      contract,
      registerStep,
      language,
      timezone,
      createdAt,
      updatedAt,
      stripeCustomerId,
      ...filteredData
    } = user.dataValues;

    return res.status(200).json({
      error: false,
      message: "OK",
      data: filteredData,
    });
  } catch (err) {
    // Send error response
    return res.status(500).json({
      err: true,
      message: "Internal Server Error",
    });
  }
};
const HandleResetForgetPass = async (req, res) => {
  try {
    const { token, password } = req.body;
    // Validate request body
    const { error } = bodyValidation.ResetPassBodyValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    // Check if user exists and verify password
    const user = await Users.findOne({
      where: { forgotToken: token },
    });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid Token",
      });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    user.password = hashPassword;
    user.forgotToken = "";
    await user.save();

    await res.status(200).json({
      error: false,
      message: "password successfully changed",
    });
  } catch (err) {
    // Send error response
    res.status(500).json({
      err: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  handelRegister,
  handelLogin,
  handelUserLogin,
  HandleRequestForgetPass,
  HandleVerifyForgetPass,
  HandleResetForgetPass,
};

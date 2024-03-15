const Users = require("../../../../models").Users;
const Validation = require("../../../../utils/dashboard/validationSchema");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const readFileAsync = promisify(fs.readFile);

//Generate Referral code
const generateCode = (length = 6) => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excluding characters like I, O, Q, 0, 1
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;
};

const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: [
          "token",
          "password",
          "forgotToken",
          "contract",
          "stripeCustomerId",
        ],
      },
    });
    return res.json({
      error: false,
      data: users,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Server error!",
    });
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await Users.findAll({
      where: { role: 3000, status: 1 },
      attributes: {
        exclude: [
          "token",
          "password",
          "forgotToken",
          "contract",
          "stripeCustomerId",
        ],
      },
    });
    return res.status(200).json({
      error: false,
      data: authors,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const getTeachers = async (req, res) => {
  try {
    const teachers = await Users.findAll({
      where: { role: 1000, status: 1 },
      attributes: {
        exclude: [
          "token",
          "password",
          "forgotToken",
          "contract",
          "stripeCustomerId",
        ],
      },
    });
    return res.status(200).json({
      error: false,
      data: teachers,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const data = req.body;
    const { error } = Validation.NewUserBodyValidation(data);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const existUser = await Users.findOne({ where: { email: data.email } });
    if (existUser) {
      return res.status(400).json({
        error: true,
        message: "This email is already registered",
      });
    }

    let imageData = null;
    if (req.file) {
      imageData = process.env.BASE_URL + "/" + req.file.path;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const referralCode = generateCode();
    const user = await Users.create({
      ...data,
      password: hashedPassword,
      referralCode,
      avatar: imageData,
    });
    return res.status(201).json({
      error: false,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const getUserWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({
      where: { id },
      attributes: {
        exclude: [
          "token",
          "password",
          "forgotToken",
          "contract",
          "registerStep",
          "language",
          "timezone",
          "createdAt",
          "updatedAt",
          "stripeCustomerId",
        ],
      },
    });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }
    return res.status(200).json({
      error: false,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const getUserWithEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(
      "yesssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss" + email
    );
    const user = await Users.findOne({
      where: { email },
      attributes: {
        exclude: [
          "token",
          "password",
          "forgotToken",
          "contract",
          "registerStep",
          "language",
          "timezone",
          "createdAt",
          "updatedAt",
          "stripeCustomerId",
        ],
      },
    });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }
    return res.status(200).json({
      error: false,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const { error } = Validation.UserEditBodyValidation(data);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    var user = await Users.findOne({ where: { id: data.id } });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found!",
      });
    }

    if (data.password) {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    if (req.file) {
      data.avatar = process.env.BASE_URL + "/" + req.file.path;
    }

    var user = await Users.findOne({ where: { id: data.id } });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found!",
      });
    }
    const EmailExists = await Users.findOne({ where: { email: data.email } });
    if (EmailExists && EmailExists.id !== user.id) {
      return res.status(400).json({
        error: true,
        message: "User with this email already exists!",
      });
    }
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        user[key] = data[key];
      }
    }

    await user.save();
    return res.status(201).json({
      error: false,
      message: "The user updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found",
      });
    }
    await user.destroy();
    return res.status(201).json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const importUsers = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No file uploaded." });
    }

    const filePath = req.file.path;
    const usersData = [];

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        const user = {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          phone: row.phone,
          password: row.password,
          address: row.address,
          postalCode: row.postalCode,
          country: row.country,
          city: row.city,
          avatar: null,
          language: "en",
          timezone: "gmt-05",
          emailVerification: 1,
          dateOfBirth: "",
          status: 1,
          vip: row.vip,
          registerStep: 5,
          token: null,
          forgetToken: null,
          contract: 1,
          referralCode: generateCode(),
          stripeCustomerId: null,
          credit: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        usersData.push(user);
      })
      .on("end", async () => {
        for (const userData of usersData) {
          // Check if user already exists
          const existingUser = await Users.findOne({where:{ email: userData.email} });
          if (existingUser) {
            console.log(`Skipping existing user: ${userData.email}`);
            continue; // Skip this user and proceed with the next one
          }

          // Hash the password for new users
          const salt = await bcrypt.genSalt(10);
          userData.password = await bcrypt.hash(userData.password, salt);

          // Create new user since they don't exist
          await Users.create(userData);
        }
        res
          .status(201)
          .json({
            error: false,
            message: "Users imported successfully, existing users skipped.",
          });
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: true, message: "Server error during user import." });
  }
};

module.exports = {
  getUsers,
  getUserWithId,
  updateUser,
  deleteUser,
  createUser,
  getAuthors,
  getTeachers,
  importUsers,
  getUserWithEmail,
};

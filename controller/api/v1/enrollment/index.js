const Enrollments = require("../../../../models").Enrollments;
const Users = require("../../../../models").Users;
const Courses = require("../../../../models").Courses;
const CourseCycles = require("../../../../models").CourseCycles;
const Transactions = require("../../../../models").Transactions;

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollments.findAll({
      include: [
        {
          model: Courses,
          as: "course",
        },
        {
          model: CourseCycles,
          as: "cycle",
        },
        {
          model: Users,
          as: "user",
          attributes: {
            exclude: [
              "password",
              "forgotToken",
              "token",
              "registerStep",
              "contract",
              "stripeCustomerId",
            ],
          },
        },
        {
          model: Transactions,
          as: "transaction",
          attributes: {
            exclude: [
              "courseId",
              "cycleId",
              "Stripe_Charge_ID",
              "Currency",
              "coupons",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
      attributes: {
        exclude: [
          "courseId",
          "cycleId",
          "Stripe_Charge_ID",
          "Currency",
          "coupons",
          "createdAt",
          "updatedAt",
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      error: false,
      data: enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error,
    });
  }
};

const creteNewEnroll = async (req, res) => {};
const updateEnroll = async (req, res) => {};
const getEnrollWithId = async (req, res) => {};
const deleteEnroll = async (req, res) => {};

module.exports = {
  getEnrollments,
  creteNewEnroll,
  updateEnroll,
  getEnrollWithId,
  deleteEnroll,
};

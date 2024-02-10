const { json } = require("sequelize");

const Transactions = require("../../../../models").Transactions;
const Courses = require("../../../../models").Courses;
const Users = require("../../../../models").Users;
const CourseCycles = require("../../../../models").CourseCycles;
const TransactionCourses = require("../../../../models").TransactionCourses;
const TransactionCycles = require("../../../../models").TransactionCycles;

//Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transactions.findAll({
      include: [
        {
          model: Courses,
          as: "courses",
        },
        {
          model: CourseCycles,
          as: "cycles",
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
    // Log the transactions to check the data
    return res.status(200).json({
      error: false,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Create transactions
const creteNewTransaction = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Update transactions
const updateTransaction = async (req, res) => {
  try {
    const { id, items, status } = req.body;

    const transaction = await Transactions.findOne({
      where: { Transaction_ID: id },
    });

    if (!transaction) {
      return res.status(404).json({
        error: true,
        message: "Transaction not found - 404",
      });
    }
    const courseIds = items.map((item) => item.value);
    const courseCycles = [];

    for (const courseId of courseIds) {
      const selectedCycle = await CourseCycles.findOne({
        where: { courseId: courseId },
        order: [["createdAt", "DESC"]],
      }); // Assuming 'createdAt' can determine the latest
      if (selectedCycle) {
        courseCycles.push(selectedCycle.id); // Assuming you want to push the cycle's ID
      }
    }

    transaction.Transaction_Status = status;
    transaction.courseId = courseIds;
    transaction.cycleId = courseCycles;

    for (const course of courseIds) {
      const checkCourseExist = await TransactionCourses.findOne({
        where: { transaction_ID: id, courseId: course },
      });

      if (!checkCourseExist) {
        await TransactionCourses.create({
          Transaction_ID: id,
          courseId: course,
        });
      }
    }
    for (const cycle of courseCycles) {
      const checkCycleExist = await TransactionCycles.findOne({
        where: { transaction_ID: id, cycleId: cycle },
      });

      if (!checkCycleExist) {
        await TransactionCycles.create({ Transaction_ID: id, cycleId: cycle });
      }
    }

    await transaction.save();

    return res.status(200).json({
      error: false,
      message: "Transaction edited.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Get transaction with ID
const getTransactionWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transactions.findOne({
      where: { transaction_ID: id },
      include: [
        {
          model: Courses,
          as: "courses",
        },
        {
          model: CourseCycles,
          as: "cycles",
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
      ],
      attributes: {
        exclude: ["courseId", "cycleId", "createdAt", "updatedAt"],
      },
    });

    if (!transaction) {
      return res.status(401).json({
        error: true,
        message: "Transaction with this ID doesn't exist!",
      });
    }

    console.log(transaction.courses);

    res.status(200).json({
      error: false,
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Delete transactions
const deleteTransaction = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
module.exports = {
  getTransactions,
  creteNewTransaction,
  updateTransaction,
  getTransactionWithId,
  deleteTransaction,
};

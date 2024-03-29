//Import Model
const Tests = require("../../../../models").Tests;
const Questions = require("../../../../models").Questions;
const Answers = require("../../../../models").Answers;
const TestPerCycle = require("../../../../models").TestPerCycle;
const Validation = require("../../../../utils/dashboard/validationSchema");

const getTests = async (req, res) => {
  try {
    const tests = await Tests.findAll();
    return res.status(200).json({
      error: false,
      data: tests,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const creteNewTest = async (req, res) => {
  try {
    const params = req.body;

    //Validate req body
    const { err } = Validation.createNewTestBodyValidation(params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const checkExistTest = await Tests.findOne({
      where: {
        cycleId: params.cycleId,
        title: params.title,
      },
    });

    if (checkExistTest) {
      let title = params.title;
      let counter = 1;
      while (true) {
        const newTitle = `${title} Copy${counter > 1 ? " " + counter : ""}`;
        const slug = newTitle
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        const existingTest = await Tests.findOne({
          where: {
            cycleId: params.cycleId,
            title: newTitle,
          },
        });
        if (!existingTest) {
          params.title = newTitle;
          params.slug = slug;
          break;
        }
        counter++;
      }
    } else {
      const slug = params.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      params.slug = slug;
    }
    const newTest = await Tests.create({ ...params });
    await TestPerCycle.create({
      testId: parseInt(newTest.dataValues.id),
      courseId: parseInt(params.courseId),
      cycleId: parseInt(params.cycleId),
    });
    return res.status(201).json({
      error: false,
      message: "Test created successfully",
      data: newTest,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const updateTest = async (req, res) => {
  try {
    const params = req.body;
    //Validate req body
    const { err } = Validation.updateTestBodyValidation(params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const test = await Tests.findOne({ where: { id: params.id } });
    if (!test) {
      return res.status(400).json({
        error: true,
        message: "Test with this ID doesn't exist!",
      });
    }
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        test[key] = params[key];
      }
    }

    const updatedTest = await test.save();
    const testPerCycle = await TestPerCycle.findOne({
      where: { testId: updatedTest.id },
    });
    if (testPerCycle) {
      testPerCycle.cycleId = updatedTest.cycleId;
      testPerCycle.courseId = params.courseId;
      await testPerCycle.save();
    } else {
      await TestPerCycle.create({
        testId: parseInt(test.id),
        courseId: parseInt(params.courseId),
        cycleId: parseInt(params.cycleId),
      });
    }
    return res.status(201).json({
      error: false,
      message: "The Test updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const getTestWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 30; // Default to 10 records per page if not provided
    const offset = (page - 1) * limit;

    //Validate req body
    const { err } = Validation.getTestWithIdBodyValidation(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const test = await Tests.findOne({ where: { id } });
    if (!test) {
      return res.status(400).json({
        error: true,
        message: "Test with this ID doesn't exist!",
      });
    }
    const questions = await Questions.findAndCountAll({
      where: { testId: id },
      limit: limit,
      offset: offset,
      include: [
        {
          model: Answers,
          as: "answers",
        },
      ],
    });

    return res.status(200).json({
      error: false,
      data: test,
      questions: questions.rows,
      currentPage: page,
      totalPages: Math.ceil(questions.count / limit),
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const deleteTest = async (req, res) => {
  try {
    const id = req.params.id;
    //Validate req body
    const { err } = Validation.deleteTestWithIdBodyValidation(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    const test = await Tests.findOne({ where: { id } });
    if (!test) {
      return res.status(400).json({
        error: true,
        message: "Test with this ID doesn't exist!",
      });
    }

    const testPerCycle = await TestPerCycle.findOne({ where: { testId: id } });
    if (testPerCycle) {
      await testPerCycle.destroy();
    }

    // Find all questions related to the test
    const questions = await Questions.findAll({ where: { testId: id } });

    // Delete all answers related to each question
    for (const question of questions) {
      await Answers.destroy({ where: { questionId: question.id } });
    }

    // After deleting answers, delete all questions
    await Questions.destroy({ where: { testId: id } });

    // Finally, delete the test
    await test.destroy();

    return res.status(200).json({
      error: false,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

module.exports = {
  getTests,
  creteNewTest,
  updateTest,
  getTestWithId,
  deleteTest,
};

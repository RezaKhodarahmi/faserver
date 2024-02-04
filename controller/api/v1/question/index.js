//Import Model
const Questions = require("../../../../models").Questions;
const Answers = require("../../../../models").Answers;
// At the top of your question controller file
const fs = require("fs").promises; // Use fs promises for async/await

const getQuestions = async (req, res) => {
  try {
    const questions = await Questions.findAll();
    return res.status(200).json({
      error: false,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const creteNewQuestion = async (req, res) => {
  try {
    const params = req.body;

    const createdQuestions = []; // Store the created question IDs here
    const existingArray = [];

    for (const question of params) {
      const existQuestion = await Questions.findOne({
        where: { testId: question.testId, secId: question.secId },
      });

      if (existQuestion) {
        existingArray.push({ ...existQuestion });
      } else {
        const newQuestion = await Questions.create(question);
        createdQuestions.push(newQuestion); // Store the ID of the newly created question
      }
    }

    return res.status(201).json({
      error: false,
      data: createdQuestions, // Send the IDs of the created questions
      existed: existingArray,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const params = req.body;
    console.error(params);

    // Update each question in the array
    const promises = params.map((question) => {
      return Questions.update(question, {
        where: { id: question.id },
      });
    });

    await Promise.all(promises);

    return res.status(201).json({
      error: false,
      message: "The question updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const getQuestionWithId = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const params = req.body;
    const question = await Questions.findOne({
      where: { testId: params.id, secId: params.secId },
    });

    if (!question) {
      return res.status(400).json({
        error: true,
        message: "Question with this ID doesn't exist!",
      });
    }

    // Delete associated answers
    await Answers.destroy({
      where: { questionId: question.id },
    });

    // Delete the question
    await question.destroy();

    return res.status(201).json({
      error: false,
      message: "The question and its answers deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const importFromJson = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { testId } = req.body;

  if (!testId) {
    return res.status(400).send("Please provide a test ID.");
  }

  const filePath = req.file.path;
  let count = 0; // Count the number of questions processed
  let secId = 1; // Initialize secId to assign sequential IDs to questions

  try {
    const data = await fs.readFile(filePath, "utf8");
    const questions = JSON.parse(data);

    for (const item of questions) {
      try {
        // Determine the question type based on the number of answers
        const questionType = item.answers.length.toString(); // Convert number of answers to string to match your database field type

        const question = await Questions.create({
          testId: testId,
          questionText: item.title,
          secId: secId++, // Increment secId for each question
          questionType: questionType, // Set question type based on the number of answers
          // Add other necessary fields as per your model
        });

        for (const answer of item.answers) {
          await Answers.create({
            questionId: question.id,
            answerText: answer.title,
            isCorrect: answer.is_correct,
            // Add other fields as necessary
          });
        }

        count++; // Increment count for each successfully processed question
      } catch (error) {
        console.error("Failed to insert question/answer from JSON:", error);
      }
    }

    res.status(200).json({
      error: false,
      message: `Successfully imported ${count} questions with their answers.`,
    });
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return res
      .status(500)
      .json({ error: true, message: "Error processing file" });
  }
};

// Export the modified function
module.exports = {
  getQuestions,
  creteNewQuestion,
  updateQuestion,
  getQuestionWithId,
  deleteQuestion,
  importFromJson, // Note the name change to reflect handling JSON
};

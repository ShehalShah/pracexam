const Question = require('../models/Question');

exports.addQuestion = async (req, res) => {
  const { questionText, courseName, courseId } = req.body;
  try {
    const question = new Question({ questionText, courseName, courseId });
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

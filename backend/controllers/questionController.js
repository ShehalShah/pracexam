const Question = require('../models/Question');

// Add a question
exports.addQuestion = async (req, res) => {
  const { questionNumber, questionText, courseName, courseId } = req.body;

  try {
    const question = new Question({
      questionNumber,
      questionText,
      courseName,
      courseId,
    });

    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get questions by courseId
exports.getQuestionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const questions = await Question.find({ courseId });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  const { questionNumber, questionText, courseName, courseId } = req.body;
  const { id } = req.params;

  try {
    let question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    question = await Question.findByIdAndUpdate(
      id,
      { $set: { questionNumber, questionText, courseName, courseId } },
      { new: true }
    );

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    await Question.findByIdAndRemove(id);

    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

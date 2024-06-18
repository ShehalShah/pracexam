const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');

exports.scheduleExam = async (req, res) => {
  const { courseId, courseName, batchName, examDate } = req.body;

  try {
    const questions = await Question.find({ courseId });
    const exam = new Exam({
      courseId,
      courseName,
      batchName,
      examDate,
      questions,
      studentStatus: []
    });

    await exam.save();
    res.json(exam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getExamsForStudent = async (req, res) => {
  try {
    console.log(req.user);
    const exams = await Exam.find({ batchName: req.user.batchName });
    res.json(exams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.startExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('questions');
    const question = exam.questions[Math.floor(Math.random() * exam.questions.length)];

    // Check if student status exists, if not add it
    let studentStatus = exam.studentStatus.find(status => status.studentId.toString() === req.user.id);
    if (!studentStatus) {
      studentStatus = {
        studentId: req.user.id,
        questionChanges: 0,
        completed: false
      };
      exam.studentStatus.push(studentStatus);
      await exam.save();
    }

    res.json({ question, exam });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.changeQuestion = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('questions');
    const question = exam.questions[Math.floor(Math.random() * exam.questions.length)];

    let studentStatus = exam.studentStatus.find(status => status.studentId.toString() === req.user.id);
    if (!studentStatus) {
      studentStatus = {
        studentId: req.user.id,
        questionChanges: 0,
        completed: false
      };
      exam.studentStatus.push(studentStatus);
    }
    studentStatus.questionChanges += 1;
    await exam.save();

    res.json({ question });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.submitExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);
    const studentStatus = exam.studentStatus.find(status => status.studentId.toString() === req.user.id);
    console.log(exam);

    if (studentStatus) {
      studentStatus.completed = true;
      await exam.save();
    }

    res.json({ msg: 'Exam submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

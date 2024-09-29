const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');

exports.scheduleExam = async (req, res) => {
  const { courseId, courseName, batchName, examDate, selectedQuestions } = req.body;
  const userId = req.user.id;

  try {
    const questions = await Question.find({ _id: { $in: selectedQuestions } });
    const exam = new Exam({
      courseId,
      courseName,
      batchName,
      examDate,
      questions,
      studentStatus: [],
      createdBy: userId,
      createdAt: new Date(),
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

exports.getExamsForTeacher = async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.startExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('questions');
    let question = exam.questions[Math.floor(Math.random() * exam.questions.length)];

    let modifiedQuestion = { ...question._doc };

    if (modifiedQuestion.image) {
      const base64Image = modifiedQuestion.image.toString('base64');
      modifiedQuestion.image = base64Image;
    }

    let studentStatus = exam.studentStatus.find(status => status.studentId.toString() === req.user.id);
    if (!studentStatus) {
      studentStatus = {
        studentId: req.user.id,
        questionChanges: [question._id],
        completed: false
      };
      exam.studentStatus.push(studentStatus);
      await exam.save();
    } else if (studentStatus.questionChanges.length === 0) {
      studentStatus.questionChanges.push(question._id);
      await exam.save();
    }
    question=modifiedQuestion

    res.json({ question, exam });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.changeQuestion = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('questions');
    let studentStatus = exam.studentStatus.find(status => status.studentId.toString() === req.user.id);

    if (!studentStatus) {
      studentStatus = {
        studentId: req.user.id,
        questionChanges: [],
        completed: false
      };
      exam.studentStatus.push(studentStatus);
    }

    let availableQuestions = exam.questions.filter(question => !studentStatus.questionChanges.includes(question._id));
    if (availableQuestions.length === 0) {
      return res.status(400).json({ msg: 'No more new questions available.' });
    }

    let question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    let modifiedQuestion = { ...question._doc };

    if (modifiedQuestion.image) {
      const base64Image = modifiedQuestion.image.toString('base64');

      modifiedQuestion.image = base64Image;
    }

    studentStatus.questionChanges.push(question._id);
    await exam.save();
    question=modifiedQuestion

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

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find(); // Fetches all exams from the database
    res.json(exams); // Sends the exams as JSON response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
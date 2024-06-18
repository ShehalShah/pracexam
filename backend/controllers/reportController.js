const Exam = require('../models/Exam');
const User = require('../models/User');

exports.getExamReport = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('studentStatus.studentId');
    res.json(exam.studentStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

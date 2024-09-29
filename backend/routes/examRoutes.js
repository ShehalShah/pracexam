const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const Student = require('../models/User');
const Question = require('../models/Question');

// Schedule an exam
router.post('/schedule', authMiddleware(['teacher']), examController.scheduleExam);

router.get('/unique-batches', async (req, res) => {
    try {
      const batches = await Student.distinct('batchName');
      res.json(batches);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

router.get('/unique-course-ids', async (req, res) => {
    try {
      const courseIds = await Question.distinct('courseId');
      res.json(courseIds);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

// Get exams for a student
router.get('/student', authMiddleware(['student']), examController.getExamsForStudent);

// Get exams for a student
router.get('/teacher', authMiddleware(['teacher']), examController.getExamsForTeacher);

// Start an exam
router.get('/start/:examId', authMiddleware(['student']), examController.startExam);

// Change question during an exam
router.post('/change-question/:examId', authMiddleware(['student']), examController.changeQuestion);

// Submit an exam
router.post('/submit/:examId', authMiddleware(['student']), examController.submitExam);

router.get('/exams', examController.getAllExams);

module.exports = router;

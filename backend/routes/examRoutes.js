const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');

// Schedule an exam
router.post('/schedule', authMiddleware(['teacher']), examController.scheduleExam);

// Get exams for a student
router.get('/student', authMiddleware(['student']), examController.getExamsForStudent);

// Start an exam
router.get('/start/:examId', authMiddleware(['student']), examController.startExam);

// Change question during an exam
router.post('/change-question/:examId', authMiddleware(['student']), examController.changeQuestion);

// Submit an exam
router.post('/submit/:examId', authMiddleware(['student']), examController.submitExam);

module.exports = router;

const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a question
router.post('/', authMiddleware, questionController.addQuestion);

// Get all questions
router.get('/', authMiddleware, questionController.getQuestions);

module.exports = router;

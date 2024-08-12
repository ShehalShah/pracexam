const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a question
router.post('/', authMiddleware(['teacher']), questionController.addQuestion);

// send q ids get qs
router.post('/by-ids', questionController.fetchByids);

router.post('/update', questionController.updateQuestion);

// Get all questions
router.get('/', questionController.getQuestions);

// Get questions by course ID
router.get('/course/:courseId', questionController.getQuestionsByCourse);

// Update a question
// router.put('/:id', authMiddleware(['teacher']), questionController.updateQuestion);

// Delete a question
router.delete('/:id', authMiddleware(['teacher']), questionController.deleteQuestion);

module.exports = router;

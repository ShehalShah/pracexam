const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Get exam report
router.get('/exam/:examId', authMiddleware(['teacher']), reportController.getExamReport);

module.exports = router;

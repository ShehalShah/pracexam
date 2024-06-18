const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadStudents, uploadQuestions } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post('/students', authMiddleware(['teacher']), upload.single('file'), uploadStudents);
router.post('/questions', authMiddleware(['teacher']), upload.single('file'), uploadQuestions);

module.exports = router;

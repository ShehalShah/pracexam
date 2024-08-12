const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register user
router.post(
  '/register',
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').isLength({ min: 6 }),
    check('role', 'Role is required').not().isEmpty(),
  ],
  authController.register
);

// Login user
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

// Get user data
router.get('/', authMiddleware(), authController.getUser);

router.post('/students/batch', authController.getStudentsByBatch);


module.exports = router;

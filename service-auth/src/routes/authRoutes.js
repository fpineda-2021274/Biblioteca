const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
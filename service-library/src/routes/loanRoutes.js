const express = require('express');
const router = express.Router();
const {
    createLoan,
    createReturn,
    getActiveLoans,
    getAllLoans,
} = require('../controllers/loanController');
const { loanValidation, returnValidation } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/loans', authMiddleware, getAllLoans);
router.get('/loans/active', authMiddleware, getActiveLoans);
router.post('/loans', authMiddleware, loanValidation, createLoan);
router.post('/returns', authMiddleware, returnValidation, createReturn);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
    getStatistics,
    getCategories,
    getRecommendations,
    getSummary,
} = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/statistics', authMiddleware, getStatistics);
router.get('/statistics/categories', authMiddleware, getCategories);
router.get('/recommendations/:category', authMiddleware, getRecommendations);
router.get('/summary', authMiddleware, getSummary);

module.exports = router;
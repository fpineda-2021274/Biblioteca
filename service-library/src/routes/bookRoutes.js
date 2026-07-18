const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} = require('../controllers/bookController');
const { bookValidation } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/books', authMiddleware, getAllBooks);
router.get('/books/:id', authMiddleware, getBookById);
router.post('/books', authMiddleware, bookValidation, createBook);
router.put('/books/:id', authMiddleware, bookValidation, updateBook);
router.delete('/books/:id', authMiddleware, deleteBook);

module.exports = router;
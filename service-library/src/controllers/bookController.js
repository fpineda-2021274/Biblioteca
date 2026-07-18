const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
    try {
        const { titulo, autor, categoria, disponible, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (titulo) filter.titulo = { $regex: titulo, $options: 'i' };
        if (autor) filter.autor = { $regex: autor, $options: 'i' };
        if (categoria) filter.categoria = { $regex: categoria, $options: 'i' };
        if (disponible !== undefined) filter.disponible = disponible === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Book.countDocuments(filter);
        const books = await Book.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                books,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los libros.',
            error: error.message,
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Libro no encontrado.',
            });
        }
        res.status(200).json({
            success: true,
            data: { book },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el libro.',
            error: error.message,
        });
    }
};

const createBook = async (req, res) => {
    try {
        const { titulo, autor, categoria, anio, disponible } = req.body;
        const book = new Book({ titulo, autor, categoria, anio, disponible });
        await book.save();

        res.status(201).json({
            success: true,
            message: 'Libro creado exitosamente.',
            data: { book },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el libro.',
            error: error.message,
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Libro no encontrado.',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Libro actualizado exitosamente.',
            data: { book },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el libro.',
            error: error.message,
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Libro no encontrado.',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Libro eliminado exitosamente.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el libro.',
            error: error.message,
        });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};
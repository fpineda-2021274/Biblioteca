const Loan = require('../models/Loan');
const Book = require('../models/Book');

const createLoan = async (req, res) => {
    try {
        const { libro, usuario } = req.body;

        const book = await Book.findById(libro);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Libro no encontrado.',
            });
        }

        if (!book.disponible) {
            return res.status(400).json({
                success: false,
                message: 'El libro no está disponible para préstamo.',
            });
        }

        const loan = new Loan({ libro, usuario });
        await loan.save();

        book.disponible = false;
        book.totalPrestamos += 1;
        await book.save();

        const populatedLoan = await Loan.findById(loan._id).populate('libro');

        res.status(201).json({
            success: true,
            message: 'Préstamo registrado exitosamente.',
            data: { loan: populatedLoan },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar el préstamo.',
            error: error.message,
        });
    }
};

const createReturn = async (req, res) => {
    try {
        const { loanId } = req.body;

        const loan = await Loan.findById(loanId).populate('libro');
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Préstamo no encontrado.',
            });
        }

        if (loan.devuelto) {
            return res.status(400).json({
                success: false,
                message: 'Este préstamo ya fue devuelto.',
            });
        }

        loan.devuelto = true;
        loan.fechaDevolucion = new Date();
        await loan.save();

        await Book.findByIdAndUpdate(loan.libro._id, { disponible: true });

        res.status(200).json({
            success: true,
            message: 'Devolución registrada exitosamente.',
            data: { loan },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar la devolución.',
            error: error.message,
        });
    }
};

const getActiveLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ devuelto: false })
            .populate('libro')
            .sort({ fechaPrestamo: -1 });

        res.status(200).json({
            success: true,
            data: { loans },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los préstamos.',
            error: error.message,
        });
    }
};

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('libro')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { loans },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los préstamos.',
            error: error.message,
        });
    }
};

module.exports = { createLoan, createReturn, getActiveLoans, getAllLoans };
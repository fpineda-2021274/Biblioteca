const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

const bookValidation = [
    body('titulo')
        .trim()
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 200 }).withMessage('El título no puede exceder 200 caracteres'),
    body('autor')
        .trim()
        .notEmpty().withMessage('El autor es obligatorio')
        .isLength({ max: 150 }).withMessage('El autor no puede exceder 150 caracteres'),
    body('categoria')
        .trim()
        .notEmpty().withMessage('La categoría es obligatoria')
        .isIn([
            'Ficción', 'No ficción', 'Ciencia', 'Tecnología', 'Historia',
            'Filosofía', 'Arte', 'Educación', 'Infantil', 'Poesía',
            'Drama', 'Biografía', 'Otros',
        ]).withMessage('La categoría no es válida'),
    body('anio')
        .notEmpty().withMessage('El año es obligatorio')
        .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
        .withMessage('El año debe ser un número válido'),
    handleValidation,
];

const loanValidation = [
    body('libro')
        .notEmpty().withMessage('El ID del libro es obligatorio')
        .isMongoId().withMessage('El ID del libro no es válido'),
    body('usuario')
        .trim()
        .notEmpty().withMessage('El nombre del usuario es obligatorio')
        .isLength({ max: 150 }).withMessage('El nombre del usuario no puede exceder 150 caracteres'),
    handleValidation,
];

const returnValidation = [
    body('loanId')
        .notEmpty().withMessage('El ID del préstamo es obligatorio')
        .isMongoId().withMessage('El ID del préstamo no es válido'),
    handleValidation,
];

module.exports = { bookValidation, loanValidation, returnValidation };
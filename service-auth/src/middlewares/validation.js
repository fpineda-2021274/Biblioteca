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

const registerValidation = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Ingrese un correo electrónico válido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleValidation,
];

const loginValidation = [
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Ingrese un correo electrónico válido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleValidation,
];

module.exports = { registerValidation, loginValidation };
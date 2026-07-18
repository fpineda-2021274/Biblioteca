const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
            maxlength: [200, 'El título no puede exceder 200 caracteres'],
        },
        autor: {
            type: String,
            required: [true, 'El autor es obligatorio'],
            trim: true,
            maxlength: [150, 'El autor no puede exceder 150 caracteres'],
        },
        categoria: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            trim: true,
            enum: {
                values: [
                    'Ficción',
                    'No ficción',
                    'Ciencia',
                    'Tecnología',
                    'Historia',
                    'Filosofía',
                    'Arte',
                    'Educación',
                    'Infantil',
                    'Poesía',
                    'Drama',
                    'Biografía',
                    'Tecnología',
                    'Otros',
                ],
                message: 'La categoría {VALUE} no es válida',
            },
        },
        anio: {
            type: Number,
            required: [true, 'El año de publicación es obligatorio'],
            min: [1000, 'El año debe ser mayor a 1000'],
            max: [new Date().getFullYear() + 1, 'El año no puede ser futuro'],
        },
        disponible: {
            type: Boolean,
            default: true,
        },
        totalPrestamos: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

bookSchema.index({ titulo: 'text', autor: 'text' });

module.exports = mongoose.model('Book', bookSchema);
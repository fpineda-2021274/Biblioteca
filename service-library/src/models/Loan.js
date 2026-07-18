const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
    {
        libro: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'El libro es obligatorio'],
        },
        usuario: {
            type: String,
            required: [true, 'El nombre del usuario es obligatorio'],
            trim: true,
        },
        fechaPrestamo: {
            type: Date,
            default: Date.now,
        },
        fechaDevolucion: {
            type: Date,
            default: null,
        },
        devuelto: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Loan', loanSchema);
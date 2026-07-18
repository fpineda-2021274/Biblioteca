require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'auth' });
});

app.use((err, req, res, next) => {
    console.error('[Auth] Error no manejado:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

app.listen(PORT, () => {
    console.log(`[Auth] Servicio corriendo en http://localhost:${PORT}`);
});
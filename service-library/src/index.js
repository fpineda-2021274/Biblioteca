require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/', bookRoutes);
app.use('/', loanRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'library' });
});

app.use((err, req, res, next) => {
    console.error('[Library] Error no manejado:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

app.listen(PORT, () => {
    console.log(`[Library] Servicio corriendo en http://localhost:${PORT}`);
});
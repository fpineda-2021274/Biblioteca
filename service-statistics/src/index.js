require('dotenv').config();
const express = require('express');
const cors = require('cors');
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/', statisticsRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'statistics' });
});

app.use((err, req, res, next) => {
    console.error('[Statistics] Error no manejado:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

app.listen(PORT, () => {
    console.log(`[Statistics] Servicio corriendo en http://localhost:${PORT}`);
});
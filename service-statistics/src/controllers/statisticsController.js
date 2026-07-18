const { fetchBooks, fetchAllLoans } = require('../services/libraryService');

const getStatistics = async (req, res) => {
    try {
        const token = req.token;
        const [books, loans] = await Promise.all([
            fetchBooks(token),
            fetchAllLoans(token),
        ]);

        const totalBooks = books.length;
        const totalLoans = loans.length;
        const activeLoans = loans.filter((l) => !l.devuelto).length;
        const completedLoans = loans.filter((l) => l.devuelto).length;
        const availableBooks = books.filter((b) => b.disponible).length;
        const unavailableBooks = books.filter((b) => !b.disponible).length;

        const librosMasPrestados = [...books]
            .sort((a, b) => b.totalPrestamos - a.totalPrestamos)
            .slice(0, 10)
            .map((b) => ({
                _id: b._id,
                titulo: b.titulo,
                autor: b.autor,
                totalPrestamos: b.totalPrestamos,
            }));

        const librosRecientes = [...books]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map((b) => ({
                _id: b._id,
                titulo: b.titulo,
                autor: b.autor,
                categoria: b.categoria,
                createdAt: b.createdAt,
            }));

        const categorias = {};
        books.forEach((b) => {
            categorias[b.categoria] = (categorias[b.categoria] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            data: {
                resumen: {
                    totalBooks,
                    totalLoans,
                    activeLoans,
                    completedLoans,
                    availableBooks,
                    unavailableBooks,
                },
                librosMasPrestados,
                librosRecientes,
                categorias,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas.',
            error: error.message,
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const token = req.token;
        const books = await fetchBooks(token);

        const categorias = {};
        books.forEach((b) => {
            if (!categorias[b.categoria]) {
                categorias[b.categoria] = { cantidad: 0, disponibles: 0 };
            }
            categorias[b.categoria].cantidad += 1;
            if (b.disponible) categorias[b.categoria].disponibles += 1;
        });

        const result = Object.entries(categorias).map(([nombre, datos]) => ({
            nombre,
            cantidad: datos.cantidad,
            disponibles: datos.disponibles,
        }));

        res.status(200).json({
            success: true,
            data: { categorias: result },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías.',
            error: error.message,
        });
    }
};

const getRecommendations = async (req, res) => {
    try {
        const { category } = req.params;
        const token = req.token;
        const books = await fetchBooks(token);

        let recommended = books.filter(
            (b) => b.categoria.toLowerCase() === category.toLowerCase() && b.disponible
        );

        if (recommended.length === 0) {
            recommended = books
                .filter((b) => b.disponible)
                .sort((a, b) => b.totalPrestamos - a.totalPrestamos)
                .slice(0, 5);
        }

        res.status(200).json({
            success: true,
            data: {
                category,
                recommendations: recommended.slice(0, 10),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener recomendaciones.',
            error: error.message,
        });
    }
};

const getSummary = async (req, res) => {
    try {
        const token = req.token;
        const [books, loans] = await Promise.all([
            fetchBooks(token),
            fetchAllLoans(token),
        ]);

        const totalBooks = books.length;
        const totalLoans = loans.length;
        const activeLoans = loans.filter((l) => !l.devuelto).length;
        const availableBooks = books.filter((b) => b.disponible).length;

        const categorias = {};
        books.forEach((b) => {
            categorias[b.categoria] = (categorias[b.categoria] || 0) + 1;
        });
        const topCategory = Object.entries(categorias).sort((a, b) => b[1] - a[1])[0];

        const topBook = [...books].sort((a, b) => b.totalPrestamos - a.totalPrestamos)[0];

        const recentCount = books.filter((b) => {
            const diff = Date.now() - new Date(b.createdAt).getTime();
            return diff < 30 * 24 * 60 * 60 * 1000;
        }).length;

        res.status(200).json({
            success: true,
            data: {
                resumenGeneral: {
                    totalLibros: totalBooks,
                    totalPrestamos: totalLoans,
                    prestamosActivos: activeLoans,
                    librosDisponibles: availableBooks,
                    librosAgregadosRecientemente: recentCount,
                },
                categoriaMasPopular: topCategory
                    ? { nombre: topCategory[0], cantidad: topCategory[1] }
                    : null,
                libroMasPrestado: topBook
                    ? { titulo: topBook.titulo, autor: topBook.autor, totalPrestamos: topBook.totalPrestamos }
                    : null,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el resumen.',
            error: error.message,
        });
    }
};

module.exports = { getStatistics, getCategories, getRecommendations, getSummary };
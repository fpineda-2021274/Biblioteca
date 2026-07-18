import { useState, useEffect } from 'react';
import { statisticsService } from '../services/api';

const categorias = [
    'Ficción', 'No ficción', 'Ciencia', 'Tecnología', 'Historia',
    'Filosofía', 'Arte', 'Educación', 'Infantil', 'Poesía',
    'Drama', 'Biografía', 'Otros',
];

const Recommendations = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetched, setFetched] = useState(false);

    const fetchRecommendations = async () => {
        if (!selectedCategory) {
            setError('Selecciona una categoría.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await statisticsService.getRecommendations(selectedCategory);
            setRecommendations(response.data.data.recommendations);
            setFetched(true);
        } catch (err) {
            setError('Error al obtener las recomendaciones.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Recomendaciones</h2>
                    <p className="page-subtitle">Descubre libros recomendados por categoría</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '24px', maxWidth: '500px' }}>
                <h3 className="card-title" style={{ marginBottom: '16px' }}>Buscar por Categoría</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ flex: 1 }}
                    >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={fetchRecommendations}
                        disabled={loading}
                    >
                        {loading ? 'Buscando...' : '🔍 Buscar'}
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {fetched && !loading && (
                <>
                    {recommendations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">💡</div>
                            <p className="empty-state-text">
                                No se encontraron libros disponibles en la categoría "{selectedCategory}"
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                Intenta con otra categoría o agrega libros al catálogo.
                            </p>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Recomendaciones: <span className="badge badge-info">{selectedCategory}</span>
                                </h3>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Autor</th>
                                            <th>Año</th>
                                            <th>Préstamos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recommendations.map((book) => (
                                            <tr key={book._id}>
                                                <td style={{ fontWeight: 500 }}>{book.titulo}</td>
                                                <td>{book.autor}</td>
                                                <td>{book.anio}</td>
                                                <td><span className="badge badge-info">{book.totalPrestamos}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Recommendations;
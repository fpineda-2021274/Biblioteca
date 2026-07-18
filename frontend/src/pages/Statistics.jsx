import { useState, useEffect } from 'react';
import { statisticsService } from '../services/api';

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statisticsService.getStatistics();
                setStats(response.data.data);
            } catch (err) {
                setError('Error al cargar las estadísticas.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="empty-state"><p>Cargando estadísticas...</p></div>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    const resumen = stats?.resumen || {};

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Estadísticas</h2>
                    <p className="page-subtitle">Análisis y métricas de la biblioteca</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-icon">📚</div>
                    <div className="stat-card-value">{resumen.totalBooks || 0}</div>
                    <div className="stat-card-label">Total de Libros</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon">📋</div>
                    <div className="stat-card-value">{resumen.totalLoans || 0}</div>
                    <div className="stat-card-label">Total de Préstamos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon">🔄</div>
                    <div className="stat-card-value">{resumen.activeLoans || 0}</div>
                    <div className="stat-card-label">Préstamos Activos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon">✅</div>
                    <div className="stat-card-value">{resumen.completedLoans || 0}</div>
                    <div className="stat-card-label">Devoluciones Completadas</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Libros Más Prestados</h3>
                    </div>
                    {stats?.librosMasPrestados?.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Préstamos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.librosMasPrestados.map((book, index) => (
                                        <tr key={book._id}>
                                            <td>{index + 1}</td>
                                            <td style={{ fontWeight: 500 }}>{book.titulo}</td>
                                            <td>{book.autor}</td>
                                            <td>
                                                <span className="badge badge-info">{book.totalPrestamos}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">Sin datos de préstamos</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Por Categoría</h3>
                    </div>
                    {stats?.categorias && Object.keys(stats.categorias).length > 0 ? (
                        <div>
                            {Object.entries(stats.categorias)
                                .sort(([, a], [, b]) => b - a)
                                .map(([cat, count]) => (
                                    <div
                                        key={cat}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 0',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                    >
                                        <span style={{ fontSize: '14px' }}>{cat}</span>
                                        <span className="badge badge-info">{count}</span>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">Sin datos</p>
                        </div>
                    )}
                </div>
            </div>

            {stats?.librosRecientes?.length > 0 && (
                <div className="card" style={{ marginTop: '24px' }}>
                    <div className="card-header">
                        <h3 className="card-title">Libros Agregados Recientemente</h3>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Categoría</th>
                                    <th>Fecha de Agregado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.librosRecientes.map((book) => (
                                    <tr key={book._id}>
                                        <td style={{ fontWeight: 500 }}>{book.titulo}</td>
                                        <td>{book.autor}</td>
                                        <td><span className="badge badge-info">{book.categoria}</span></td>
                                        <td>
                                            {new Date(book.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;
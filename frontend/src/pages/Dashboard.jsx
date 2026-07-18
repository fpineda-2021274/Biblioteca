import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statisticsService } from '../services/api';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, statsRes] = await Promise.all([
                    statisticsService.getSummary(),
                    statisticsService.getStatistics(),
                ]);
                setSummary(summaryRes.data.data);
                setStats(statsRes.data.data);
            } catch (err) {
                setError('Error al cargar los datos del dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="empty-state">
                <div style={{ fontSize: '24px' }}>⏳</div>
                <p>Cargando dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">{error}</div>
        );
    }

    const resumen = summary?.resumenGeneral || {};

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Dashboard</h2>
                    <p className="page-subtitle">Vista general del sistema de biblioteca</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-icon">📚</div>
                    <div className="stat-card-value">{resumen.totalLibros || 0}</div>
                    <div className="stat-card-label">Total de Libros</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon">📋</div>
                    <div className="stat-card-value">{resumen.totalPrestamos || 0}</div>
                    <div className="stat-card-label">Total de Préstamos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon">🔄</div>
                    <div className="stat-card-value">{resumen.prestamosActivos || 0}</div>
                    <div className="stat-card-label">Préstamos Activos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon">✅</div>
                    <div className="stat-card-value">{resumen.librosDisponibles || 0}</div>
                    <div className="stat-card-label">Libros Disponibles</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Libros Más Prestados</h3>
                        <Link to="/books" className="btn btn-sm btn-secondary">Ver todos</Link>
                    </div>
                    {stats?.librosMasPrestados?.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Préstamos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.librosMasPrestados.slice(0, 5).map((book) => (
                                        <tr key={book._id}>
                                            <td>{book.titulo}</td>
                                            <td>{book.autor}</td>
                                            <td><span className="badge badge-info">{book.totalPrestamos}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">No hay datos de préstamos aún</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Libros Recientes</h3>
                        <Link to="/books" className="btn btn-sm btn-secondary">Ver todos</Link>
                    </div>
                    {stats?.librosRecientes?.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Categoría</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.librosRecientes.map((book) => (
                                        <tr key={book._id}>
                                            <td>{book.titulo}</td>
                                            <td>{book.autor}</td>
                                            <td><span className="badge badge-info">{book.categoria}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">No hay libros registrados aún</p>
                        </div>
                    )}
                </div>
            </div>

            {summary?.categoriaMasPopular && (
                <div className="card" style={{ marginTop: '24px' }}>
                    <div className="card-header">
                        <h3 className="card-title">Categoría Más Popular</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="badge badge-info" style={{ fontSize: '16px', padding: '8px 16px' }}>
                            {summary.categoriaMasPopular.nombre}
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            {summary.categoriaMasPopular.cantidad} libros
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
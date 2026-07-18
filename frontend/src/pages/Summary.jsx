import { useState, useEffect } from 'react';
import { statisticsService } from '../services/api';

const Summary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await statisticsService.getSummary();
                setSummary(response.data.data);
            } catch (err) {
                setError('Error al cargar el resumen.');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <div className="empty-state"><p>Cargando resumen...</p></div>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    const resumen = summary?.resumenGeneral || {};

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Resumen General</h2>
                    <p className="page-subtitle">Resumen completo del estado de la biblioteca</p>
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
                <div className="stat-card">
                    <div className="stat-card-icon">🆕</div>
                    <div className="stat-card-value">{resumen.librosAgregadosRecientemente || 0}</div>
                    <div className="stat-card-label">Agregados Recientemente</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📊 Categoría Más Popular</h3>
                    </div>
                    {summary?.categoriaMasPopular ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
                                {summary.categoriaMasPopular.nombre}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                {summary.categoriaMasPopular.cantidad} libros en esta categoría
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">Sin datos disponibles</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📖 Libro Más Prestado</h3>
                    </div>
                    {summary?.libroMasPrestado ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
                            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                                {summary.libroMasPrestado.titulo}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
                                por {summary.libroMasPrestado.autor}
                            </div>
                            <div>
                                <span className="badge badge-info" style={{ fontSize: '14px', padding: '6px 12px' }}>
                                    {summary.libroMasPrestado.totalPrestamos} préstamos
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">Sin datos disponibles</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                    <h3 className="card-title">📈 Indicadores Clave</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Tasa de Disponibilidad
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-accent)' }}>
                            {resumen.totalLibros > 0
                                ? Math.round((resumen.librosDisponibles / resumen.totalLibros) * 100)
                                : 0}%
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Tasa de Devolución
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#48BB78' }}>
                            {resumen.totalPrestamos > 0
                                ? Math.round(((resumen.totalPrestamos - resumen.prestamosActivos) / resumen.totalPrestamos) * 100)
                                : 0}%
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Promedio Préstamos/Libro
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-brown-light)' }}>
                            {resumen.totalLibros > 0
                                ? (resumen.totalPrestamos / resumen.totalLibros).toFixed(1)
                                : '0.0'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
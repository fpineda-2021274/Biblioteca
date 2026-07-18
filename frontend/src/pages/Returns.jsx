import { useState, useEffect } from 'react';
import { loanService } from '../services/api';

const Returns = () => {
    const [activeLoans, setActiveLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchActiveLoans = async () => {
        try {
            setLoading(true);
            const response = await loanService.getActive();
            setActiveLoans(response.data.data.loans);
        } catch (err) {
            setError('Error al cargar los préstamos activos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveLoans();
    }, []);

    const handleReturn = async (loanId) => {
        setError('');
        setSuccess('');
        try {
            await loanService.return({ loanId });
            setSuccess('Devolución registrada exitosamente.');
            fetchActiveLoans();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar la devolución.');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Devoluciones</h2>
                    <p className="page-subtitle">Gestiona las devoluciones de libros prestados</p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {loading ? (
                <div className="empty-state"><p>Cargando préstamos activos...</p></div>
            ) : activeLoans.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">✅</div>
                    <p className="empty-state-text">No hay préstamos activos pendientes</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                        Todos los libros han sido devueltos
                    </p>
                </div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Libro</th>
                                    <th>Autor</th>
                                    <th>Usuario</th>
                                    <th>Fecha Préstamo</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeLoans.map((loan) => (
                                    <tr key={loan._id}>
                                        <td style={{ fontWeight: 500 }}>{loan.libro?.titulo || 'N/A'}</td>
                                        <td>{loan.libro?.autor || 'N/A'}</td>
                                        <td>{loan.usuario}</td>
                                        <td>{formatDate(loan.fechaPrestamo)}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleReturn(loan._id)}
                                            >
                                                🔄 Devolver
                                            </button>
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

export default Returns;
import { useState, useEffect } from 'react';
import { loanService, bookService } from '../services/api';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ libro: '', usuario: '' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [loansRes, booksRes] = await Promise.all([
                loanService.getAll(),
                bookService.getAll({ disponible: 'true' }),
            ]);
            setLoans(loansRes.data.data.loans);
            setBooks(booksRes.data.data.books);
        } catch (err) {
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateLoan = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!form.libro || !form.usuario) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            await loanService.create(form);
            setSuccess('Préstamo registrado exitosamente.');
            setForm({ libro: '', usuario: '' });
            setShowForm(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar el préstamo.');
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
                    <h2 className="page-title">Préstamos</h2>
                    <p className="page-subtitle">Gestiona los préstamos de libros</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancelar' : '📋 Nuevo Préstamo'}
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card" style={{ marginBottom: '24px', maxWidth: '500px' }}>
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>Registrar Préstamo</h3>
                    <form onSubmit={handleCreateLoan}>
                        <div className="form-group">
                            <label className="form-label">Libro *</label>
                            <select
                                className="form-select"
                                value={form.libro}
                                onChange={(e) => setForm({ ...form, libro: e.target.value })}
                            >
                                <option value="">Seleccionar libro</option>
                                {books.map((book) => (
                                    <option key={book._id} value={book._id}>
                                        {book.titulo} - {book.autor}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nombre del Usuario *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nombre de quien solicita"
                                value={form.usuario}
                                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            📋 Registrar Préstamo
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="empty-state"><p>Cargando préstamos...</p></div>
            ) : loans.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <p className="empty-state-text">No hay préstamos registrados</p>
                </div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Libro</th>
                                    <th>Usuario</th>
                                    <th>Fecha Préstamo</th>
                                    <th>Fecha Devolución</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan) => (
                                    <tr key={loan._id}>
                                        <td style={{ fontWeight: 500 }}>{loan.libro?.titulo || 'N/A'}</td>
                                        <td>{loan.usuario}</td>
                                        <td>{formatDate(loan.fechaPrestamo)}</td>
                                        <td>{formatDate(loan.fechaDevolucion)}</td>
                                        <td>
                                            <span className={`badge ${loan.devuelto ? 'badge-success' : 'badge-warning'}`}>
                                                {loan.devuelto ? 'Devuelto' : 'Activo'}
                                            </span>
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

export default Loans;
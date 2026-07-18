import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/api';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const [filterDisponible, setFilterDisponible] = useState('');
    const [deleteModal, setDeleteModal] = useState(null);

    const categorias = [
        'Ficción', 'No ficción', 'Ciencia', 'Tecnología', 'Historia',
        'Filosofía', 'Arte', 'Educación', 'Infantil', 'Poesía',
        'Drama', 'Biografía', 'Otros',
    ];

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.titulo = search;
            if (filterCategoria) params.categoria = filterCategoria;
            if (filterDisponible !== '') params.disponible = filterDisponible;

            const response = await bookService.getAll(params);
            setBooks(response.data.data.books);
        } catch (err) {
            setError('Error al cargar los libros.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [search, filterCategoria, filterDisponible]);

    const handleDelete = async (id) => {
        try {
            await bookService.delete(id);
            setDeleteModal(null);
            fetchBooks();
        } catch (err) {
            setError('Error al eliminar el libro.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Libros</h2>
                    <p className="page-subtitle">Gestiona el catálogo de libros</p>
                </div>
                <Link to="/books/add" className="btn btn-primary">
                    ➕ Agregar Libro
                </Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="filter-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por título o autor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="form-select"
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <select
                    className="form-select"
                    value={filterDisponible}
                    onChange={(e) => setFilterDisponible(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="true">Disponible</option>
                    <option value="false">No disponible</option>
                </select>
            </div>

            {loading ? (
                <div className="empty-state">
                    <p>Cargando libros...</p>
                </div>
            ) : books.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <p className="empty-state-text">No se encontraron libros</p>
                    <Link to="/books/add" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        Agregar primer libro
                    </Link>
                </div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Categoría</th>
                                    <th>Año</th>
                                    <th>Estado</th>
                                    <th>Préstamos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book._id}>
                                        <td style={{ fontWeight: 500 }}>{book.titulo}</td>
                                        <td>{book.autor}</td>
                                        <td><span className="badge badge-info">{book.categoria}</span></td>
                                        <td>{book.anio}</td>
                                        <td>
                                            <span className={`badge ${book.disponible ? 'badge-success' : 'badge-danger'}`}>
                                                {book.disponible ? 'Disponible' : 'Prestado'}
                                            </span>
                                        </td>
                                        <td>{book.totalPrestamos}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <Link to={`/books/edit/${book._id}`} className="btn btn-sm btn-secondary">
                                                    ✏️
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => setDeleteModal(book)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Confirmar Eliminación</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            ¿Estás seguro de que deseas eliminar "<strong>{deleteModal.titulo}</strong>"?
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteModal._id)}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;
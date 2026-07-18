import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { bookService } from '../services/api';

const categorias = [
    'Ficción', 'No ficción', 'Ciencia', 'Tecnología', 'Historia',
    'Filosofía', 'Arte', 'Educación', 'Infantil', 'Poesía',
    'Drama', 'Biografía', 'Otros',
];

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        titulo: '',
        autor: '',
        categoria: '',
        anio: '',
        disponible: true,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await bookService.getById(id);
                const book = response.data.data.book;
                setForm({
                    titulo: book.titulo,
                    autor: book.autor,
                    categoria: book.categoria,
                    anio: book.anio,
                    disponible: book.disponible,
                });
            } catch (err) {
                setError('Error al cargar los datos del libro.');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.titulo || !form.autor || !form.categoria || !form.anio) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setSaving(true);
        try {
            await bookService.update(id, {
                ...form,
                anio: parseInt(form.anio, 10),
            });
            navigate('/books');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el libro.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="empty-state">
                <p>Cargando libro...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Editar Libro</h2>
                    <p className="page-subtitle">Modifica la información del libro</p>
                </div>
                <Link to="/books" className="btn btn-secondary">
                    ← Volver
                </Link>
            </div>

            <div className="card" style={{ maxWidth: '640px' }}>
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Título *</label>
                        <input
                            type="text"
                            name="titulo"
                            className="form-input"
                            value={form.titulo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Autor *</label>
                        <input
                            type="text"
                            name="autor"
                            className="form-input"
                            value={form.autor}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Categoría *</label>
                            <select
                                name="categoria"
                                className="form-select"
                                value={form.categoria}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Año de Publicación *</label>
                            <input
                                type="number"
                                name="anio"
                                className="form-input"
                                min="1000"
                                max={new Date().getFullYear() + 1}
                                value={form.anio}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="disponible"
                                checked={form.disponible}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                            />
                            <span className="form-label" style={{ marginBottom: 0 }}>Disponible para préstamo</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Guardando...' : '💾 Actualizar Libro'}
                        </button>
                        <Link to="/books" className="btn btn-secondary">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBook;
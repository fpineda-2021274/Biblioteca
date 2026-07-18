import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookService } from '../services/api';

const categorias = [
    'Ficción', 'No ficción', 'Ciencia', 'Tecnología', 'Historia',
    'Filosofía', 'Arte', 'Educación', 'Infantil', 'Poesía',
    'Drama', 'Biografía', 'Otros',
];

const AddBook = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        titulo: '',
        autor: '',
        categoria: '',
        anio: '',
        disponible: true,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        try {
            await bookService.create({
                ...form,
                anio: parseInt(form.anio, 10),
            });
            navigate('/books');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el libro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Agregar Libro</h2>
                    <p className="page-subtitle">Agrega un nuevo libro al catálogo</p>
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
                            placeholder="Título del libro"
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
                            placeholder="Nombre del autor"
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
                                placeholder="Ej: 2024"
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
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : '💾 Guardar Libro'}
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

export default AddBook;
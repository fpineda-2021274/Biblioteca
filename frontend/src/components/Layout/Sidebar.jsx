import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
    {
        section: 'Principal',
        items: [
            { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        ],
    },
    {
        section: 'Gestión',
        items: [
            { path: '/books', icon: '📚', label: 'Libros' },
            { path: '/books/add', icon: '➕', label: 'Agregar Libro' },
            { path: '/loans', icon: '📋', label: 'Préstamos' },
            { path: '/returns', icon: '🔄', label: 'Devoluciones' },
        ],
    },
    {
        section: 'Análisis',
        items: [
            { path: '/statistics', icon: '📈', label: 'Estadísticas' },
            { path: '/recommendations', icon: '💡', label: 'Recomendaciones' },
            { path: '/summary', icon: '📝', label: 'Resumen' },
        ],
    },
];

const Sidebar = ({ collapsed, onToggle }) => {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">📖</div>
                    {!collapsed && <span className="sidebar-logo-text">BiblioApp</span>}
                </div>
                <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expandir' : 'Colapsar'}>
                    {collapsed ? '▶' : '◀'}
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((section) => (
                    <div key={section.section}>
                        {!collapsed && (
                            <div className="sidebar-section-label">{section.section}</div>
                        )}
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                                title={collapsed ? item.label : undefined}
                            >
                                <span className="sidebar-link-icon">{item.icon}</span>
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="sidebar-link"
                    onClick={logout}
                    style={{ width: '100%' }}
                    title={collapsed ? 'Cerrar sesión' : undefined}
                >
                    <span className="sidebar-link-icon">🚪</span>
                    {!collapsed && <span>Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
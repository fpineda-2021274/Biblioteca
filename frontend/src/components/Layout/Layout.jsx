import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/books': 'Gestión de Libros',
    '/books/add': 'Agregar Libro',
    '/loans': 'Préstamos',
    '/returns': 'Devoluciones',
    '/statistics': 'Estadísticas',
    '/recommendations': 'Recomendaciones',
    '/summary': 'Resumen General',
};

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    const title = pageTitles[location.pathname] || 'BiblioApp';

    return (
        <div className="app-layout">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar title={title} />
                <main className="page-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
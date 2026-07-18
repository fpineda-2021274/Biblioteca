import { useAuth } from '../../context/AuthContext';

const Navbar = ({ title }) => {
    const { user } = useAuth();

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="navbar">
            <h1 className="navbar-title">{title}</h1>
            <div className="navbar-actions">
                <div className="navbar-user">
                    <div className="navbar-avatar">
                        {getInitials(user?.nombre)}
                    </div>
                    <span className="navbar-username">{user?.nombre || 'Usuario'}</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
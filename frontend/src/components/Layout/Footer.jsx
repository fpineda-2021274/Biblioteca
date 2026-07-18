const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer-text">
                &copy; {new Date().getFullYear()} BiblioApp - Sistema de Gestión de Biblioteca. Todos los derechos reservados.
            </p>
        </footer>
    );
};

export default Footer;
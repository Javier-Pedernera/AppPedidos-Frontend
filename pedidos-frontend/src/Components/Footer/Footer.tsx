
import '../../scss/components/footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section1">
                    {/* <h3>Políticas y Términos</h3>
                <ul>
                    <li><a href="/politica-de-privacidad">Política de Privacidad</a></li>
                    <li><a href="/terminos-y-condiciones">Términos y Condiciones</a></li>
                    <li><a href="/politica-de-cookies">Política de Cookies</a></li>
                </ul> */}
                </div>
                <div className="footer-section2">
                    <h3>Información de Contacto</h3>
                    <p>Dirección: 123 Calle Principal, Ciudad, País</p>
                    <p>Teléfono: +1234567890 / Correo electrónico: info@example.com</p>

                </div>
                <div className="footer-section3">
                    <p>© 2024 Mi Empresa. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
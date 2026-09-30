import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/images/Logo1.png" alt="Isabella Flores" />
          </Link>
          <p>Creamos arreglos florales para convertir momentos especiales en recuerdos inolvidables.</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces</h3>
          <Link to="/">Inicio</Link>
          <Link to="/tienda">Tienda en línea</Link>
          <Link to="/trabajos">Nuestros trabajos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/experiencias">Experiencias</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/cotizacion">Pedidos personalizados</Link>
          <Link to="/metodos-de-pago">Métodos de pago</Link>
        </div>
        <div className="footer-section">
          <h3>Contáctanos</h3>
          <a href="tel:+522441374286"><Phone size={16} />244 137 4286</a>
          <span className="footer-detail"><MapPin size={16} />Atlixco, Puebla</span>
          <a href="https://www.facebook.com/profile.php?id=61594027933855&locale=es_LA" target="_blank" rel="noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.4 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6H17V3.5c-.4-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.5V13h2.8v8h3.1Z" /></svg>Facebook</a>
          <a href="https://web.whatsapp.com/" target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Isabella Floristeria. Todos los derechos reservados.</p>
        <p>Desarrollada por Francisco Soriano.</p>
        <p>Encargada de marketing Evelyn Soriano.</p>
      </div>
    </footer>
  );
}

export default Footer;

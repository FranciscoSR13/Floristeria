import { Camera, MapPin, Phone } from "lucide-react";
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
          <Link to="/trabajos">Nuestros trabajos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/experiencias">Experiencias</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="footer-section">
          <h3>Contáctanos</h3>
          <a href="tel:+522441374286"><Phone size={16} />244 137 4286</a>
          <span className="footer-detail"><MapPin size={16} />Atlixco, Puebla</span>
          <a href="https://instagram.com"><Camera size={16} />Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Isabella Flores. Todos los derechos reservados.</p>
        <p>Desarrollada por Francisco Soriano.</p>
        <p>Encargada de marketing Evelyn Soriano.</p>
      </div>
    </footer>
  );
}

export default Footer;

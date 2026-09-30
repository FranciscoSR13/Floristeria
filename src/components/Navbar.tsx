import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, MessageCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/images/Logo1.png" alt="Isabella Flores" />
        </Link>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
          <Menu size={24} />
        </button>
        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Inicio</NavLink>
          <NavLink to="/tienda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Tienda</NavLink>
          <NavLink to="/trabajos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Nuestros trabajos</NavLink>
          <NavLink to="/nosotros" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Nosotros</NavLink>
          <NavLink to="/experiencias" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Experiencias</NavLink>
          <NavLink to="/contacto" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Contacto</NavLink>
          <NavLink to={user ? "/cuenta" : "/login"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>{user ? "Mi cuenta" : "Iniciar sesión"}</NavLink>
        </nav>
        <div className="navbar-actions">
          <a href="https://www.facebook.com/profile.php?id=61594027933855&locale=es_LA" className="social-link facebook-link" aria-label="Facebook" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.4 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6H17V3.5c-.4-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.5V13h2.8v8h3.1Z" /></svg></a>
          <a href="https://web.whatsapp.com/" className="social-link whatsapp-link" aria-label="WhatsApp" target="_blank" rel="noreferrer"><MessageCircle size={19} /></a>
          <Link to="/carrito" className="cart-button" aria-label="Carrito de compras"><ShoppingBag size={19} /></Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

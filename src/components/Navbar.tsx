import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Camera, Menu, ShoppingBag } from "lucide-react";

function Navbar() {
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
          <NavLink to="/trabajos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Nuestros trabajos</NavLink>
          <NavLink to="/nosotros" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Nosotros</NavLink>
          <NavLink to="/experiencias" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Experiencias</NavLink>
          <NavLink to="/contacto" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Contacto</NavLink>
        </nav>
        <div className="navbar-actions">
          <a href="https://instagram.com" className="social-link" aria-label="Instagram"><Camera size={19} /></a>
          <Link to="/trabajos" className="cart-button" aria-label="Ver arreglos"><ShoppingBag size={19} /></Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

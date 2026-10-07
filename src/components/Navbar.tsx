import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, MessageCircle, ShoppingBag } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      const activeElement = document.activeElement;
      const headerHasFocus = Boolean(
        headerRef.current?.contains(activeElement)
        && activeElement instanceof HTMLElement
        && activeElement.matches(":focus-visible")
      );

      if (menuOpen || headerHasFocus || currentScrollY <= 90) {
        setIsHidden(false);
      } else if (scrollDelta > 5) {
        setIsHidden(true);
      } else if (scrollDelta < -5) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className={`navbar${isHidden ? " navbar-hidden" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/images/Logo1.png" alt="Isabella Floristería" />
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
          <NavLink to="/tienda" aria-label="Tienda, próximamente" className={({ isActive }) => isActive ? "nav-link active nav-store-link" : "nav-link nav-store-link"} onClick={closeMenu}>
            <span>Tienda</span>
            <span className="nav-soon-badge" aria-hidden="true">
              <svg viewBox="0 0 100 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="shop-ribbon-red" x1="0" y1="0" x2="0.8" y2="1">
                    <stop offset="0" stopColor="#ff5966" />
                    <stop offset="0.48" stopColor="#e2162a" />
                    <stop offset="1" stopColor="#a80018" />
                  </linearGradient>
                </defs>
                <path d="M35 0h13l52 30v14L35 12z" fill="url(#shop-ribbon-red)" />
                <path d="M89 44 100 50v6q0 4-3 2l-8-6z" fill="#990014" />
                <path d="M35 1h13l52 30" fill="none" stroke="#ffc1c4" strokeOpacity=".72" strokeWidth="1.3" />
                <path d="m89 44 11 6" fill="none" stroke="#780010" strokeWidth="1.5" />
                <text x="38" y="7" transform="rotate(30 38 7)" fill="#fff" fontFamily="Arial Narrow, Arial, sans-serif" fontSize="7.8" fontWeight="800" letterSpacing=".05">PRÓXIMAMENTE</text>
              </svg>
            </span>
          </NavLink>
        </nav>
        <div className="navbar-actions">
          <a href="https://www.facebook.com/profile.php?id=61594027933855&locale=es_LA" className="social-link facebook-link" aria-label="Facebook" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.4 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6H17V3.5c-.4-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.5V13h2.8v8h3.1Z" /></svg></a>
          <a href="/contacto#ayuda" className="social-link whatsapp-link" aria-label="Ir al formulario de contacto"><MessageCircle size={19} /></a>
          <Link to="/carrito" className="cart-button" aria-label="Carrito de compras"><ShoppingBag size={19} /></Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

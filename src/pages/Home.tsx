import { useEffect, useRef } from "react";
import { ArrowRight, BadgeCheck, CakeSlice, ChevronRight, Clock3, Flower2, Gift, Heart, MapPin, PackageCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Ramos", icon: Flower2, image: "/images/Flores%20disp/Ramos.jpg" },
  { name: "Girasoles", icon: Flower2, image: "/images/Flores%20disp/Girasoles.jpg" },
  { name: "Gladiolas", icon: Flower2, image: "/images/Flores%20disp/Gradiolas.jpg" },
  { name: "Centros de mesa", icon: Flower2, image: "/images/Flores%20disp/Centros%20de%20mesa.jpg" },
  { name: "Cempasúchitl y terciopelo por manojo", icon: Flower2, image: "/images/Flores%20disp/cempasuchitl%20y%20terciopelo%20por%20manojo.jpg" },
  { name: "Macetas de cempasúchitl", icon: Flower2, image: "/images/Flores%20disp/MacetasCempasuchitl.jpg" },
];


const facebookUrl = "https://www.facebook.com/profile.php?id=61594027933855&locale=es_LA";

function Home() {
  const firstPanelRef = useRef<HTMLElement>(null);
  const secondPanelRef = useRef<HTMLElement>(null);
  const thirdPanelRef = useRef<HTMLElement>(null);
  const fourthPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const panels = [firstPanelRef.current, secondPanelRef.current, thirdPanelRef.current, fourthPanelRef.current]
      .filter((panel): panel is HTMLElement => panel !== null);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
    }, { threshold: 0.12 });
    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="storefront">
      <section className="home-screen-panel home-screen-one" ref={firstPanelRef}>
      <div className="delivery-strip"><Truck size={15} /> Flores frescas y entregas el mismo día <span>·</span> Hecho con cariño en Atlixco, Puebla</div>
      <section className="store-hero image-hero">
        <img className="hero-photo" src="/images/IMG_inicioweb.png" alt="Isabella Floristería: Flores eternas, tus momentos; arreglo floral en tonos rosas" />
        <div className="delivery-card quote-card">
          <div className="quote-copy">
            <span className="quote-kicker"><MapPin size={15} /> COTIZACIÓN PERSONALIZADA</span>
            <strong>¿A dónde lo enviamos?</strong>
            <p>Muéstranos tu idea y comencemos a cotizar.</p>
          </div>
          <Link className="whatsapp-quote" to="/contacto#ayuda">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.02 3.2A12.7 12.7 0 0 0 5.08 22.35L3.4 28.5l6.3-1.65A12.72 12.72 0 1 0 16.02 3.2Zm0 23.25c-1.9 0-3.76-.5-5.4-1.45l-.39-.23-3.74.98 1-3.64-.25-.4a10.5 10.5 0 1 1 8.78 4.74Zm5.76-7.86c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.73.16-.22.32-.83 1.04-1.02 1.26-.19.21-.38.24-.7.08-.33-.16-1.38-.51-2.63-1.62-.98-.87-1.64-1.95-1.83-2.28-.19-.32-.02-.49.14-.65.15-.14.33-.38.49-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.62-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.33-1.13 1.1-1.13 2.68 0 1.59 1.16 3.12 1.32 3.34.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.1 1.9-.78 2.17-1.54.27-.76.27-1.4.19-1.54-.08-.14-.3-.22-.62-.38Z"/></svg>
            Cotizar por WhatsApp <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <section className="category-section section-container">
        <div className="section-heading-store"><div><span className="eyebrow pink">SIEMPRE DISPONIBLES</span><h2>Flores que siempre tenemos</h2></div><Link to="/trabajos" className="subtle-link">Ver todos <ArrowRight size={16} /></Link></div>
        <p style={{ margin: "-10px 0 22px", color: "#796e6c", fontSize: 13, lineHeight: 1.6 }}>Los precios de nuestras flores varían según el día y la temporada. Por eso no manejamos precios fijos; contáctanos para cotizar.</p>
        <div className="category-row">{categories.map(({ name, icon: Icon, image }) => <Link to="/contacto#ayuda" className="category-tile" key={name}><span className="category-image"><img src={image} alt="" /><span className="category-icon"><Icon size={17} /></span></span><span className="category-name">{name}</span></Link>)}</div>
      </section>

      </section>
      <section className="home-screen-panel home-screen-season">
        <section className="seasonal-section">
          <div className="seasonal-heading">
            <span className="seasonal-kicker"><Sparkles size={15} /> FLORES DE TEMPORADA</span>
            <h2>Tradición que florece.</h2>
            <p>Se acerca Día de Muertos: recibimos la temporada con los tonos intensos del cempasúchil y el terciopelo. Y pronto, el rojo festivo de las nochebuenas.</p>
          </div>
          <div className="seasonal-cards">
            <article className="seasonal-card seasonal-card-marigold">
              <img src="/images/Flores%20disp/MacetasCempasuchitl.jpg" alt="Maceta de flores de cempasúchil" loading="lazy" />
              <div className="seasonal-card-shade" />
              <span className="seasonal-badge">EN TEMPORADA</span>
              <div className="seasonal-card-copy"><span>01 · DÍA DE MUERTOS</span><h3>Cempasúchil</h3><p>El naranja que guía los recuerdos.</p></div>
            </article>
            <article className="seasonal-card seasonal-card-velvet">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNXk5s2ScKP3Z94Bs-gcX5Y405nIFW1uWPyhG8tZRzw&s=10" alt="Flor de terciopelo" loading="lazy" />
              <div className="seasonal-card-shade" />
              <span className="seasonal-badge">EN TEMPORADA</span>
              <div className="seasonal-card-copy"><span>02 · COLOR Y TEXTURA</span><h3>Terciopelo</h3><p>Un toque profundo para tu ofrenda.</p></div>
            </article>
            <article className="seasonal-card seasonal-card-poinsettia">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDj97EbmnZGQccZKy8TkqJdRwxJvQHDNLZu7cway6hUQ&s=10" alt="Nochebuena roja" loading="lazy" />
              <div className="seasonal-card-shade" />
              <span className="seasonal-badge seasonal-badge-soon">PRÓXIMAMENTE</span>
              <div className="seasonal-card-copy"><span>03 · SE ACERCA NAVIDAD</span><h3>Nochebuenas</h3><p>Muy pronto llegará su rojo brillante.</p></div>
            </article>
          </div>
          <Link className="seasonal-cta" to="/contacto#ayuda">Pregunta por las flores de temporada <ArrowRight size={16} /></Link>
        </section>
      </section>
      <section className="home-screen-panel home-screen-two" ref={secondPanelRef}>
      <section className="home-facebook-section">
        <div className="home-facebook-card">
          <span className="home-facebook-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.4 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6H17V3.5c-.4-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.5V13h2.8v8h3.1Z" /></svg></span>
          <div><span className="eyebrow pink">SIGAMOS EN CONTACTO</span><h2>También estamos en Facebook</h2><p>Visita nuestra página para ver novedades, flores y momentos de Isabella Floristería.</p></div>
          <a className="home-facebook-link" href={facebookUrl} target="_blank" rel="noreferrer">Visitar Facebook <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      </section>
      <section className="home-screen-panel home-screen-three" ref={thirdPanelRef}>
      <section className="promise-band"><div className="section-container promise-inner"><div className="promise-title"><span className="eyebrow">DETALLES QUE LLEGAN AL CORAZÓN</span><h2>Flores bonitas.<br />Momentos inolvidables.</h2><Link to="/nosotros" className="light-link">Conoce nuestra floristería <ArrowRight size={16} /></Link></div><div className="promise-items"><article><span><BadgeCheck /></span><div><strong>Flores frescas</strong><p>Seleccionadas con cuidado cada mañana.</p></div></article><article><span><Clock3 /></span><div><strong>Entrega el mismo día</strong><p>Preparamos tu sorpresa para que llegue a tiempo.</p></div></article><article><span><PackageCheck /></span><div><strong>Hecho a mano</strong><p>Cada ramo tiene su propio toque especial.</p></div></article></div></div></section>

      <section className="newsletter-band"><div className="newsletter-inner"><span className="eyebrow">COTIZA TU ARREGLO FLORAL</span><h2>Comencemos con tu idea.</h2><p>Cuéntanos qué tienes en mente y creemos algo especial.</p><Link className="quote-cta" to="/contacto#ayuda"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.02 3.2A12.7 12.7 0 0 0 5.08 22.35L3.4 28.5l6.3-1.65A12.72 12.72 0 1 0 16.02 3.2Zm0 23.25c-1.9 0-3.76-.5-5.4-1.45l-.39-.23-3.74.98 1-3.64-.25-.4a10.5 10.5 0 1 1 8.78 4.74Zm5.76-7.86c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.73.16-.22.32-.83 1.04-1.02 1.26-.19.21-.38.24-.7.08-.33-.16-1.38-.51-2.63-1.62-.98-.87-1.64-1.95-1.83-2.28-.19-.32-.02-.49.14-.65.15-.14.33-.38.49-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.62-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.33-1.13 1.1-1.13 2.68 0 1.59 1.16 3.12 1.32 3.34.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.1 1.9-.78 2.17-1.54.27-.76.27-1.4.19-1.54-.08-.14-.3-.22-.62-.38Z"/></svg>Quiero comenzar a cotizar <ArrowRight size={16} /></Link></div></section>
      </section>
      <section className="home-screen-panel home-screen-four" ref={fourthPanelRef}>
      <section className="occasion-section section-container"><div className="occasion-image promo-image"><img src="/images/Promocion_img.jpg" alt="Promoción especial de Isabella Floristería: ramo con globo, lazo y tarjeta personalizada" /></div><div className="occasion-copy"><span className="eyebrow pink">UN MOTIVO PARA SONREÍR</span><h2>Haz que hoy<br />se sienta especial.</h2><p>Un cumpleaños, un gracias o simplemente porque sí. Elige tus flores favoritas y nosotros nos encargamos de hacerlas llegar.</p><Link to="/contacto" className="store-button">Personaliza tu pedido <ArrowRight size={17} /></Link><div className="occasion-foot"><Heart size={15} fill="currentColor" /> Preparado con cariño en Atlixco, Puebla</div></div></section>
      </section>

    </div>
  );
}

export default Home;

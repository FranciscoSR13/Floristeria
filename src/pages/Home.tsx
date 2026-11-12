import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, ChevronRight, Clock3, Flower2, Heart, MapPin, PackageCheck, Snowflake, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Ramos", icon: Flower2, image: "/images/Flores%20disp/Ramos.jpg" },
  { name: "Girasoles", icon: Flower2, image: "/images/Flores%20disp/Girasoles.jpg" },
  { name: "Gladiolas", icon: Flower2, image: "/images/Flores%20disp/Gradiolas.jpg" },
  { name: "Centros de mesa", icon: Flower2, image: "/images/Flores%20disp/Centros%20de%20mesa.jpg" },
];


const facebookUrl = "https://www.facebook.com/profile.php?id=61594027933855&locale=es_LA";

const holidayMessages = [
  "Esta Navidad, regalemos momentos que florecen",
  "Flores frescas para llenar de color tus fiestas",
  "Regala nochebuenas y comparte la magia navideña",
  "Un detalle floral para celebrar con quienes más quieres",
];

function HolidayAnnouncementBar() {
  const [activeMessage, setActiveMessage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveMessage((current) => (current + 1) % holidayMessages.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="delivery-strip holiday-announcement" aria-live="polite" aria-atomic="true">
      <span className="holiday-announcement-decoration" aria-hidden="true"><Sparkles /><Snowflake /><Sparkles /></span>
      <span className="holiday-announcement-copy" key={activeMessage}>{holidayMessages[activeMessage]}</span>
      <span className="holiday-announcement-decoration" aria-hidden="true"><Sparkles /><Snowflake /><Sparkles /></span>
    </div>
  );
}

function Snowfall() {
  const [flakes] = useState<CSSProperties[]>(() => Array.from({ length: 60 }, () => {
    const duration = 7 + Math.random() * 8;
    const sway = () => `${Math.round((Math.random() - 0.5) * 90)}px`;
    const spin = Math.random() < 0.5 ? -1 : 1;

    return {
      left: `${2 + Math.random() * 96}%`,
      fontSize: `${12 + Math.random() * 17}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${duration}s`,
      "--snow-sway-one": sway(),
      "--snow-sway-two": sway(),
      "--snow-sway-three": sway(),
      "--snow-sway-end": sway(),
      "--snow-rotation-one": `${spin * (40 + Math.random() * 130)}deg`,
      "--snow-rotation-two": `${spin * (150 + Math.random() * 180)}deg`,
      "--snow-rotation-three": `${spin * (280 + Math.random() * 260)}deg`,
      "--snow-rotation-end": `${spin * (400 + Math.random() * 360)}deg`,
    } as CSSProperties;
  }));

  return (
    <div className="snowfall-layer" aria-hidden="true">
      {flakes.map((style, index) => (
        <span
          className="snowflake"
          key={index}
          style={style}
        >
          ❄
        </span>
      ))}
    </div>
  );
}

function HolidayBranch({ className }: { className: string }) {
  return (
    <svg className={`holiday-branch ${className}`} viewBox="0 0 180 150" fill="none" aria-hidden="true">
      <path className="holiday-branch-stem" d="M8 141C48 118 96 72 172 7" />
      <path className="holiday-branch-needles" d="M27 129L12 103M34 125L56 134M49 111L29 83M58 105L82 112M75 89L54 59M84 82L108 89M101 67L81 38M111 60L135 68M128 44L116 18M138 37L160 42M18 109L8 107M18 109L14 120M44 117L32 108M44 117L41 130M67 96L54 87M67 96L65 109M91 75L79 66M91 75L89 87M116 53L105 44M116 53L115 65M143 31L134 23M143 31L143 42" />
      <path className="holiday-branch-leaf" d="M55 108C42 94 43 81 53 78C62 76 67 84 68 93C73 79 88 77 92 85C96 94 87 100 78 102C92 101 98 113 89 119C82 124 72 118 68 112C62 125 49 124 47 116C46 112 49 109 55 108Z" />
      <path className="holiday-branch-leaf" d="M105 65C94 53 96 41 105 39C112 37 117 44 118 52C123 40 136 39 140 47C143 54 135 60 128 61C141 61 145 72 137 77C131 81 123 76 119 71C114 82 102 81 100 74C99 70 102 67 105 65Z" />
      <circle className="holiday-berry" cx="56" cy="119" r="7" />
      <circle className="holiday-berry" cx="70" cy="124" r="6" />
      <circle className="holiday-berry" cx="64" cy="136" r="6.5" />
    </svg>
  );
}

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
      <Snowfall />
      <section className="home-screen-panel home-screen-one" ref={firstPanelRef}>
      <HolidayAnnouncementBar />
      <section className="store-hero image-hero">
        <img className="hero-photo" src="/images/Nimagen_principal.png" alt="Banner navideño de Isabella Floristería con rosas y lirios rosados y el mensaje Hacemos florecer tus momentos" />
        <div className="home-holiday-badge"><Sparkles size={14} aria-hidden="true" /> Navidad y Año Nuevo</div>
        <div className="delivery-card quote-card">
          <div className="quote-copy">
            <span className="quote-kicker"><MapPin size={15} /> COTIZACIÓN PERSONALIZADA</span>
            <strong>¿A dónde lo enviamos?</strong>
            <p>Muéstranos tu idea y comencemos a cotizar.</p>
          </div>
          <Link className="whatsapp-quote" to="/contacto#ayuda">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.02 3.2A12.7 12.7 0 0 0 5.08 22.35L3.4 28.5l6.3-1.65A12.72 12.72 0 1 0 16.02 3.2Zm0 23.25c-1.9 0-3.76-.5-5.4-1.45l-.39-.23-3.74.98 1-3.64-.25-.4a10.5 10.5 0 1 1 8.78 4.74Zm5.76-7.86c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.73.16-.22.32-.83 1.04-1.02 1.26-.19.21-.38.24-.7.08-.33-.16-1.38-.51-2.63-1.62-.98-.87-1.64-1.95-1.83-2.28-.19-.32-.02-.49.14-.65.15-.14.33-.38.49-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.62-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.33-1.13 1.1-1.13 2.68 0 1.59 1.16 3.12 1.32 3.34.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.1 1.9-.78 2.17-1.54.27-.76.27-1.4.19-1.54-.08-.14-.3-.22-.62-.38Z"/></svg>
            Cotizar por WhatsApp <ChevronRight size={16} />
            <svg className="quote-santa-hat" viewBox="0 0 42 34" aria-hidden="true" focusable="false">
              <path d="M6 24C10 12 20 5 32 4c-4 6-2 12 5 16-10-4-21-2-30 5Z" fill="#bd1f32" />
              <path d="M8 19C14 11 21 7 29 6" fill="none" stroke="#e95b68" strokeLinecap="round" strokeWidth="2" />
              <path d="M5 23c9-6 22-8 33-3l2 5c-11-5-24-3-34 4l-3-4 2-2Z" fill="#fffdfb" />
              <circle cx="33" cy="5" r="5" fill="#fffdfb" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="category-section section-container home-floral-section">
        <img className="home-floral-banner" src="/images/banner_flores_siempre_tenemos_4x.png" alt="Flores que siempre tenemos. Los precios de nuestras flores var\u00edan seg\u00fan el d\u00eda y la temporada. Cont\u00e1ctanos para cotizar." />
        <div className="category-row">{categories.map(({ name, icon: Icon, image }) => <Link to="/contacto#ayuda" className="category-tile" key={name}><span className="category-image"><img src={image} alt="" /><span className="category-icon"><Icon size={17} /></span></span><span className="category-name">{name}</span></Link>)}</div>
        <Link to="/trabajos" className="subtle-link home-floral-all-link"><Flower2 size={16} aria-hidden="true" /> Ver todos <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      </section>
      <section className="home-screen-panel home-screen-season">
        <section className="seasonal-section">
          <HolidayBranch className="holiday-branch-left" />
          <HolidayBranch className="holiday-branch-right" />
          <div className="seasonal-heading">
            <span className="seasonal-kicker"><Sparkles size={15} aria-hidden="true" /> NAVIDAD Y A&Ntilde;O NUEVO</span>
            <h2>Una nochebuena para celebrar.</h2>
            <p>Llena tus fiestas de color con nochebuenas: el detalle perfecto para compartir la magia de la Navidad y recibir un nuevo a&ntilde;o.</p>
          </div>
          <div className="seasonal-cards">
            <article className="seasonal-card seasonal-card-poinsettia">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDj97EbmnZGQccZKy8TkqJdRwxJvQHDNLZu7cway6hUQ&s=10" alt="Nochebuena roja" loading="lazy" />
              <div className="seasonal-card-shade" />
              <span className="seasonal-badge">ESP&Iacute;RITU FESTIVO</span>
              <div className="seasonal-card-copy"><span>NAVIDAD &#183; A&Ntilde;O NUEVO</span><h3>Nochebuenas</h3><p>Color, calidez y buenos deseos para compartir en estas fiestas.</p></div>
            </article>
          </div>
          <Link className="seasonal-cta" to="/contacto#ayuda">Cotiza tus nochebuenas <ArrowRight size={16} /></Link>
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

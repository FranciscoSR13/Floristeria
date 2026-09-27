import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const photos = [
  { file: "WhatsApp Image 2026-09-25 at 7.49.36 PM.jpeg", description: "Ramo en tonos rosa con lirios, rosas y follaje fresco." },
  { file: "WhatsApp Image 2026-09-25 at 7.49.36 PM (1).jpeg", description: "Ramo rosa con un tierno peluche y envoltura decorativa." },
  { file: "WhatsApp Image 2026-09-25 at 7.49.36 PM (2).jpeg", description: "Rosas rosadas acompañadas de mariposas y detalles alegres." },
  { file: "WhatsApp Image 2026-09-25 at 7.49.36 PM (3).jpeg", description: "Rosas en tonos suaves y flores blancas con un mensaje especial." },
  { file: "WhatsApp Image 2026-09-25 at 7.49.36 PM (4).jpeg", description: "Composición llena de color con rosas en tonos cálidos y rosados." },
  { file: "WhatsApp Image 2026-09-25 at 7.49.37 PM.jpeg", description: "Gerberas rosas presentadas en un ramo delicado." },
  { file: "WhatsApp Image 2026-09-25 at 7.49.37 PM (1).jpeg", description: "Ramo de rosas y flores blancas con un saludo de felicitación." },
  { file: "WhatsApp Image 2026-09-25 at 7.49.37 PM (2).jpeg", description: "Mezcla alegre de flores blancas, amarillas y fucsias." },
  { file: "WhatsApp Image 2026-09-25 at 7.50.02 PM.jpeg", description: "Selección de rosas y flores de temporada en varios colores." },
  { file: "WhatsApp Image 2026-09-25 at 7.50.02 PM (1).jpeg", description: "Ramo con rosas rojas, flores claras y follaje abundante." },
  { file: "WhatsApp Image 2026-09-25 at 7.50.37 PM.jpeg", description: "Arreglo en tonos rojos y rosados con pequeñas flores blancas." },
  { file: "WhatsApp Image 2026-09-25 at 7.50.37 PM (1).jpeg", description: "Ramo vibrante de gerberas, rosas y flores amarillas." },
  { file: "WhatsApp Image 2026-09-25 at 7.50.37 PM (2).jpeg", description: "Flores amarillas protagonistas de un detalle luminoso." },
  { file: "WhatsApp Image 2026-09-25 at 7.50.37 PM (3).jpeg", description: "Arreglo mixto con rosas, flores pequeñas y verdes frescos." },
  { file: "WhatsApp Image 2026-09-25 at 7.50.37 PM (4).jpeg", description: "Ramo de rosas rojas, flores amarillas y follaje texturizado." },
  { file: "WhatsApp Image 2026-09-25 at 7.53.17 PM.jpeg", description: "Rosas rojas y flores blancas pequeñas en un arreglo romántico." },
];

const imagePath = (filename: string) => `/images/Trabajos/${encodeURIComponent(filename)}`;

function Trabajos() {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [needsPlayback, setNeedsPlayback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryScreenRef = useRef<HTMLElement>(null);
  const videoScreenRef = useRef<HTMLElement>(null);
  const moveReel = (direction: number) => setSelectedPhoto((current) => (current + direction + photos.length) % photos.length);

  useEffect(() => {
    const screens = [galleryScreenRef.current, videoScreenRef.current].filter((screen): screen is HTMLElement => screen !== null);
    const entranceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
    }, { threshold: 0.12 });
    screens.forEach((screen) => entranceObserver.observe(screen));

    const video = videoRef.current;
    const videoObserver = video ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.96) {
          void video.play().then(() => setNeedsPlayback(false)).catch(() => setNeedsPlayback(true));
        } else {
          video.pause();
          setNeedsPlayback(false);
        }
      });
    }, { threshold: [0, 0.96, 1] }) : null;
    if (video && videoObserver) videoObserver.observe(video);

    return () => {
      entranceObserver.disconnect();
      videoObserver?.disconnect();
      video?.pause();
    };
  }, []);

  const startVideo = () => {
    const video = videoRef.current;
    if (video) void video.play().then(() => setNeedsPlayback(false)).catch(() => setNeedsPlayback(true));
  };

  return (
    <main className="works-page">
      <section className="work-screen-section work-gallery-screen" ref={galleryScreenRef}>
        <div className="page-header">
          <div className="section-container">
            <span className="section-label">PORTAFOLIO</span>
            <h1>Nuestros trabajos</h1>
            <p>Una selección de nuestros arreglos y diseños florales.</p>
          </div>
        </div>
        <div className="works-reel-section" aria-label="Galería de trabajos florales">
          <div className="works-reel-heading">
            <div>
              <span className="section-label">HECHOS CON FLORES, HECHOS CON CARIÑO</span>
              <h2>Un vistazo a nuestro trabajo</h2>
            </div>
          </div>
          <div className="works-reel">
            <div className="reel-controls">
              <button type="button" aria-label="Ver fotos anteriores" onClick={() => moveReel(-1)}><ChevronLeft /></button>
              <button type="button" aria-label="Ver más fotos" onClick={() => moveReel(1)}><ChevronRight /></button>
            </div>
            {photos.map((photo, index) => {
              const offset = (index - selectedPhoto + photos.length + Math.floor(photos.length / 2)) % photos.length - Math.floor(photos.length / 2);
              return (
                <button
                  className={`reel-photo${index === selectedPhoto ? " is-selected" : ""}${Math.abs(offset) <= 2 ? " is-visible" : ""}`}
                  key={photo.file}
                  type="button"
                  aria-label={`Seleccionar foto ${index + 1} de ${photos.length}`}
                  aria-pressed={index === selectedPhoto}
                  onClick={() => setSelectedPhoto(index)}
                  style={{
                    "--photo-shift": `${offset * 78}%`,
                    "--photo-scale": offset === 0 ? "1.12" : offset === 1 || offset === -1 ? ".87" : ".73",
                    "--photo-angle": `${offset * -8}deg`,
                    zIndex: 5 - Math.abs(offset),
                  } as React.CSSProperties}
                >
                  <img src={imagePath(photo.file)} alt={photo.description} loading={index < 5 ? "eager" : "lazy"} />
                </button>
              );
            })}
          </div>
          <div className="selected-photo-caption" key={selectedPhoto} aria-live="polite" aria-atomic="true">
            <span>FOTO {String(selectedPhoto + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
            <p>{photos[selectedPhoto].description}</p>
            <small>Usa las flechas o elige una foto para explorar el carrete.</small>
          </div>
        </div>
      </section>

      <section className="work-screen-section work-video-section" ref={videoScreenRef}>
        <div className="work-video-layout section-container">
          <div className="work-video-copy">
            <span className="section-label">DE CERCA</span>
            <h2>Flores que cuentan historias</h2>
            <p>Conoce un poco más de nuestro trabajo y de los detalles que hacen especial cada arreglo.</p>
          </div>
          <div className="work-video-frame">
          <video ref={videoRef} className="work-video" loop playsInline preload="auto" aria-label="Video con sonido de nuestros arreglos florales" poster={imagePath(photos[0].file)}>
              <source src="/images/Trabajos/WhatsApp%20Video%202026-09-25%20at%207.50.03%20PM.mp4" type="video/mp4" />
              Tu navegador no puede reproducir este video.
            </video>
            {needsPlayback && <button className="work-video-start" type="button" onClick={startVideo}>Reproducir video con sonido</button>}
          </div>
        </div>
        <div className="center-content work-cta">
          <Link to="/contacto" className="btn btn-primary">Solicitar un diseño <ArrowRight size={18} /></Link>
        </div>
      </section>
    </main>
  );
}

export default Trabajos;

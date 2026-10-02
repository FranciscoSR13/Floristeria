import { ArrowDown, ArrowRight, Flower2, Heart, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

const imageBase = "/images/Nosotros/";

const storyPhotos = [
  { file: "IMG_1688.JPEG", alt: "Paisaje de los campos de Atlixco al pie del volcán", caption: "La tierra donde crece nuestra historia" },
  { file: "IMG_2771.jpg", alt: "Filas de cultivo preparadas para crecer", caption: "El cuidado comienza en cada surco" },
  { file: "IMG_3160.jpg", alt: "Cultivos verdes con el volcán al fondo", caption: "Nuestros campos al pie del volcán" },
  { file: "IMG_3201.jpg", alt: "Girasol creciendo entre sus hojas", caption: "Una flor que nace en nuestro campo" },
  { file: "IMG_3343.jpg", alt: "Surcos de cultivo al caer la tarde", caption: "El campo sigue su propio ritmo" },
  { file: "IMG_4534.jpg", alt: "Hileras de plantas en uno de nuestros cultivos", caption: "Cada temporada trae nuevos comienzos" },
  { file: "IMG_4741.jpg", alt: "Flores cultivadas bajo un invernadero", caption: "Cuidado en cada etapa del cultivo" },
  { file: "IMG_4748.jpg", alt: "Lisianthus en tonos lila y blanco entre el follaje", caption: "Flores que inspiran nuevas creaciones" },
  { file: "IMG_2224.JPEG", alt: "Girasoles recién cosechados", caption: "Girasoles de nuestra tradición" },
  { file: "IMG_4795.jpg", alt: "Atardecer sobre los cultivos y el volcán", caption: "Así termina un día en el campo" },
  { file: "IMG_4796.jpg", alt: "Luz dorada sobre los campos de Atlixco", caption: "Paisajes que acompañan nuestra historia" },
  { file: "IMG_4860.jpg", alt: "Girasol recién abierto en medio del cultivo", caption: "La belleza está en cada detalle" },
  { file: "IMG_4862.jpg", alt: "Girasoles floreciendo entre las plantas del campo", caption: "Flores frescas desde su origen" },
  { file: "IMG_8590.jpg", alt: "Dos personas recorriendo y revisando el cultivo", caption: "El trabajo diario que hay detrás de cada flor" },
  { file: "B3668CED-4100-4B08-887F-80963CB3DC08.jpg", alt: "Personas trabajando entre los cultivos de Atlixco", caption: "Una tradición compartida en familia" },
  { file: "28ded4511ee49ffae334e2f996148837.jpeg", alt: "Flores recién cortadas listas para su traslado", caption: "De la cosecha a nuevos destinos" },
  { file: "CFE70398-8F96-42BB-972F-F5FC644CC55A.jpg", alt: "Girasoles cosechados y acomodados para su traslado", caption: "Girasoles que alegran cada ocasión" },
];

function Nosotros() {
  return (
    <main className="about-page">
      <section className="about-story-hero">
        <img
          className="about-story-hero-image"
          src={`${imageBase}IMG_4796.jpg`}
          alt="Atardecer sobre los campos de Atlixco al pie del volcán"
        />
        <div className="about-story-hero-shade" />
        <div className="about-story-hero-copy">
          <span className="about-kicker">FLORES CON RAÍCES EN ATLIXCO</span>
          <h1>Una tradición que sigue floreciendo</h1>
          <p>De nuestra familia y nuestros campos, a momentos que se quedan contigo.</p>
          <a className="about-scroll-link" href="#nuestra-historia">
            CONOCE NUESTRA HISTORIA <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>
        <span className="about-hero-caption">Cultivamos con cariño, desde hace generaciones <i>Foto: Isabella Floristería</i></span>
      </section>

      <section className="about-origin-section" id="nuestra-historia">
        <div className="section-container about-origin-grid">
          <div className="about-photo-story">
            <img
              className="about-origin-photo"
              src={`${imageBase}B3668CED-4100-4B08-887F-80963CB3DC08.jpg`}
              alt="Girasoles creciendo entre las plantas de nuestro cultivo"
              loading="lazy"
            />
            <span className="about-origin-photo-credit">Foto: Isabella Floristería</span>
            <div className="about-photo-inset">
              <img
                src={`${imageBase}28ded4511ee49ffae334e2f996148837.jpeg`}
                alt="Manojos de flores preparados después de la cosecha"
                loading="lazy"
              />
              <span>El trabajo de muchas manos y generaciones</span>
              <small className="about-photo-credit">Foto: Isabella Floristería</small>
            </div>
            <span className="about-photo-note">ATLIXCO · PUEBLA <i>Foto: Isabella Floristería</i></span>
          </div>

          <div className="about-origin-copy">
            <span className="about-kicker about-kicker-dark">NUESTRA HISTORIA</span>
            <h2>Flores que pasan de generación en generación</h2>
            <p>
              Nuestra historia comienza mucho antes de abrir nuestra floristería. Durante
              generaciones, nuestra familia ha cultivado <strong>gladiolas y girasoles</strong>,
              con dedicación para llevar flores de calidad a personas de Atlixco y distintos
              lugares de Puebla.
            </p>
            <p>
              El cultivo se volvió más que un trabajo: es una tradición que hemos aprendido,
              cuidado y mantenido en familia. Hoy, una nueva generación continúa ese legado y
              también le da un nuevo rumbo.
            </p>
            <p>
              Seguimos cultivando las flores de nuestra historia y ahora las transformamos en
              <strong> ramos, arreglos únicos y detalles personalizados</strong>, creados para
              hacer felices a más personas.
            </p>
            <div className="about-flower-tags" aria-label="Flores de nuestra tradición">
              <span><Flower2 size={15} aria-hidden="true" /> Gladiolas</span>
              <span><Flower2 size={15} aria-hidden="true" /> Girasoles</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-moments-section">
        <div className="section-container about-moments-grid">
          <div className="about-moments-copy">
            <span className="about-kicker about-kicker-dark">HECHOS PARA COMPARTIR</span>
            <h2>Más que flores, creamos momentos</h2>
            <p>
              Un ramo puede decir mucho más que un simple “te quiero”. Acompaña una celebración,
              expresa gratitud, sorprende a alguien especial o se convierte en un recuerdo para
              toda la vida.
            </p>
            <p>
              Por eso hacemos cada arreglo con cuidado, dedicación y atención a los detalles.
              Desde un pequeño gesto hasta los momentos más importantes, ponemos creatividad y
              cariño en cada creación para que sea especial para quien la recibe.
            </p>
            <Link className="about-work-link" to="/trabajos">
              Descubre nuestros arreglos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <figure className="about-moments-photo">
            <img
              src={`${imageBase}IMG_4741.jpg`}
              alt="Flores cultivadas bajo techo que inspiran nuestros arreglos personalizados"
              loading="lazy"
            />
            <figcaption><Heart size={15} aria-hidden="true" /> Cada flor guarda una historia <small>Foto: Isabella Floristería</small></figcaption>
          </figure>
        </div>
      </section>

      <section className="about-photo-reel-section" aria-labelledby="about-photo-reel-title">
        <div className="section-container">
          <div className="about-reel-heading">
            <div>
              <span className="about-kicker about-kicker-dark">UN VISTAZO A NUESTRAS RAÍCES</span>
              <h2 id="about-photo-reel-title">Así florece nuestra historia</h2>
            </div>
            <span className="about-reel-hint">Desliza para ver más <ArrowRight size={15} aria-hidden="true" /></span>
          </div>
          <div className="about-photo-reel" role="region" aria-label="Carrete de fotos de nuestros cultivos" tabIndex={0}>
            {storyPhotos.map((photo) => (
              <figure className="about-reel-photo" key={photo.file}>
                <img src={`${imageBase}${photo.file}`} alt={photo.alt} loading="lazy" />
                <figcaption><span>{photo.caption}</span><small>Foto: Isabella Floristería</small></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="about-promise-section">
        <div className="section-container about-promise-inner">
          <div className="about-promise-heading">
            <span className="about-kicker">DE LA TIERRA A TUS MANOS</span>
            <h2>Nuestro compromiso</h2>
            <p>
              La calidad empieza en el cultivo y nos acompaña hasta que entregamos cada arreglo.
              Seleccionamos cuidadosamente nuestros materiales y atendemos cada detalle para
              ofrecer productos a la altura de nuestros clientes.
            </p>
          </div>
          <div className="about-promise-values">
            <article>
              <span><Sprout aria-hidden="true" /></span>
              <div><h3>Dedicación</h3><p>Cuidamos cada etapa, desde nuestros cultivos hasta la creación final.</p></div>
            </article>
            <article>
              <span><Heart aria-hidden="true" /></span>
              <div><h3>Responsabilidad</h3><p>Trabajamos con atención para que cada detalle llegue como lo imaginaste.</p></div>
            </article>
            <article>
              <span><Flower2 aria-hidden="true" /></span>
              <div><h3>Pasión por las flores</h3><p>Somos una familia que ama cultivar flores y compartir su belleza.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="about-closing-section">
        <div className="section-container about-closing-inner">
          <span className="about-kicker about-kicker-dark">UNA TRADICIÓN VIVA</span>
          <p>
            Lo que ha cambiado es todo lo que podemos crear con ellas. Hoy transformamos una
            tradición familiar en nuevos detalles, nuevas experiencias y nuevas formas de
            <strong> hacer felices a las personas a través de las flores.</strong>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Nosotros;

import { Flower2, Heart, Sparkles } from "lucide-react";

function Nosotros() {
  return (
    <main>
      <section className="page-header">
        <div className="section-container">
          <span className="section-label">CONÓCENOS</span>

          <h1>Sobre nosotros</h1>

          <p>
            Más que flores, creamos detalles que cuentan historias.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-container about-grid">
          <div className="about-image-placeholder">
            <span>Fotografía de la floristería</span>
          </div>

          <div className="about-content">
            <span className="section-label">NUESTRA HISTORIA</span>

            <h2>
              Pasión por las flores,
              <br />
              pasión por crear.
            </h2>

            <p>
              Nuestra floristería nació con la idea de crear
              arreglos que fueran mucho más que un simple regalo.
            </p>

            <p>
              Cada diseño busca transmitir una emoción y adaptarse
              a la persona que lo recibe. Desde un pequeño detalle
              hasta la decoración completa de un evento.
            </p>

            <p>
              Trabajamos cada arreglo de manera cuidadosa,
              seleccionando flores y combinaciones que hagan único
              cada momento.
            </p>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="section-container">
          <div className="section-heading centered">
            <span className="section-label">NUESTROS VALORES</span>

            <h2>Lo que nos representa</h2>
          </div>

          <div className="values-grid">
            <article className="value-card">
              <Flower2 size={32} />

              <h3>Creatividad</h3>

              <p>
                Buscamos nuevas formas de combinar flores, colores
                y elementos para crear diseños únicos.
              </p>
            </article>

            <article className="value-card">
              <Heart size={32} />

              <h3>Pasión</h3>

              <p>
                Ponemos dedicación y cuidado en cada arreglo que
                realizamos.
              </p>
            </article>

            <article className="value-card">
              <Sparkles size={32} />

              <h3>Calidad</h3>

              <p>
                Cuidamos cada detalle para entregar un resultado
                que supere las expectativas.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container cta-content">
          <h2>Hagamos algo especial</h2>

          <p>
            Si tienes una idea, nosotros podemos ayudarte a
            convertirla en flores.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Nosotros;    
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Trabajos() {
  return (
    <main>
      <section className="page-header">
        <div className="section-container">
          <span className="section-label">PORTAFOLIO</span>

          <h1>Nuestros trabajos</h1>

          <p>
            Una selección de nuestros arreglos y diseños florales.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-container">
          <div className="filter-buttons">
            <button className="filter-button active">Todos</button>
            <button className="filter-button">Ramos</button>
            <button className="filter-button">Eventos</button>
            <button className="filter-button">Regalos</button>
            <button className="filter-button">Diseños especiales</button>
          </div>

          <div className="works-grid">
            <article className="work-card">
              <div className="work-image-placeholder">
                <span>Fotografía 01</span>
              </div>

              <div className="work-info">
                <span>Ramos</span>
                <h3>Diseño floral especial</h3>
              </div>
            </article>

            <article className="work-card">
              <div className="work-image-placeholder">
                <span>Fotografía 02</span>
              </div>

              <div className="work-info">
                <span>Eventos</span>
                <h3>Decoración floral</h3>
              </div>
            </article>

            <article className="work-card">
              <div className="work-image-placeholder">
                <span>Fotografía 03</span>
              </div>

              <div className="work-info">
                <span>Regalos</span>
                <h3>Detalle personalizado</h3>
              </div>
            </article>

            <article className="work-card">
              <div className="work-image-placeholder">
                <span>Fotografía 04</span>
              </div>

              <div className="work-info">
                <span>Ramos</span>
                <h3>Composición floral</h3>
              </div>
            </article>

            <article className="work-card">
              <div className="work-image-placeholder">
                <span>Fotografía 05</span>
              </div>

              <div className="work-info">
                <span>Eventos</span>
                <h3>Diseño para celebración</h3>
              </div>
            </article>

            <article className="work-card">
              <div className="work-image-placeholder">
                <span>Fotografía 06</span>
              </div>

              <div className="work-info">
                <span>Especial</span>
                <h3>Creación personalizada</h3>
              </div>
            </article>
          </div>

          <div className="center-content">
            <Link to="/contacto" className="btn btn-primary">
              Solicitar un diseño
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Trabajos;
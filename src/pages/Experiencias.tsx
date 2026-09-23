import { Camera, Heart, MessageCircle, Star } from "lucide-react";

function Experiencias() {
  return (
    <main>
      <section className="page-header">
        <div className="section-container">
          <span className="section-label">CLIENTES</span>

          <h1>Experiencias</h1>

          <p>
            Descubre lo que nuestros clientes han compartido con
            nosotros.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">HISTORIAS REALES</span>

              <h2>Momentos compartidos</h2>
            </div>

            <p>
              Queremos que nuestros clientes también formen parte
              de nuestra historia.
            </p>
          </div>

          <div className="experiences-grid">
            <article className="experience-card">
              <div className="experience-image-placeholder">
                <span>Foto del cliente</span>
              </div>

              <div className="experience-info">
                <div className="experience-rating">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>

                <p>
                  "El arreglo quedó precioso y fue perfecto para
                  la ocasión. Muchas gracias por todos los detalles."
                </p>

                <strong>Cliente</strong>
              </div>
            </article>

            <article className="experience-card">
              <div className="experience-image-placeholder">
                <span>Foto del cliente</span>
              </div>

              <div className="experience-info">
                <div className="experience-rating">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>

                <p>
                  "Nos ayudaron a crear exactamente el diseño que
                  teníamos en mente. El resultado nos encantó."
                </p>

                <strong>Cliente</strong>
              </div>
            </article>

            <article className="experience-card">
              <div className="experience-image-placeholder">
                <span>Foto del cliente</span>
              </div>

              <div className="experience-info">
                <div className="experience-rating">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>

                <p>
                  "Excelente atención y un arreglo hermoso. Sin
                  duda volveríamos a comprar."
                </p>

                <strong>Cliente</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* PARTICIPAR */}
      <section className="share-experience-section">
        <div className="section-container">
          <div className="share-icon">
            <Camera size={30} />
          </div>

          <span className="section-label">COMPARTE TU EXPERIENCIA</span>

          <h2>¿Recibiste flores de nosotros?</h2>

          <p>
            Comparte una fotografía de tu arreglo y cuéntanos
            cómo fue tu experiencia.
          </p>

          <button className="btn btn-primary">
            <Camera size={18} />
            Compartir mi experiencia
          </button>

          <div className="share-features">
            <div>
              <Camera size={18} />
              <span>Comparte una foto</span>
            </div>

            <div>
              <MessageCircle size={18} />
              <span>Escribe tu experiencia</span>
            </div>

            <div>
              <Heart size={18} />
              <span>Forma parte de nuestra comunidad</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Experiencias;
import {
  Clock,
  Camera,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

function Contacto() {
  return (
    <main>
      <section className="page-header">
        <div className="section-container">
          <span className="section-label">CONTACTO</span>

          <h1>Hablemos</h1>

          <p>
            Estamos aquí para ayudarte a crear algo especial.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-container contact-grid">
          {/* INFORMACIÓN */}
          <div className="contact-info">
            <span className="section-label">ENCUÉNTRANOS</span>

            <h2>Nos encantará escucharte.</h2>

            <p>
              Ponte en contacto con nosotros para realizar una
              consulta, solicitar una cotización o conocer más
              sobre nuestros servicios.
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <strong>Ubicación</strong>
                  <span>Dirección de la floristería</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>

                <div>
                  <strong>Teléfono</strong>
                  <span>222 000 0000</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>

                <div>
                  <strong>Correo</strong>
                  <span>contacto@floristeria.com</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Clock size={20} />
                </div>

                <div>
                  <strong>Horario</strong>
                  <span>
                    Lunes - Sábado · 9:00 AM - 7:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="#" aria-label="Instagram">
                <Camera size={20} />
              </a>

            </div>
          </div>

          {/* FORMULARIO */}
          <div className="contact-form-container">
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>

                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>

                  <input
                    id="telefono"
                    type="tel"
                    placeholder="Tu teléfono"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo</label>

                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto</label>

                <select id="asunto">
                  <option value="">
                    Selecciona una opción
                  </option>

                  <option value="cotizacion">
                    Solicitar cotización
                  </option>

                  <option value="evento">
                    Diseño para evento
                  </option>

                  <option value="producto">
                    Información sobre productos
                  </option>

                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>

                <textarea
                  id="mensaje"
                  rows={6}
                  placeholder="Cuéntanos qué tienes en mente..."
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contacto;

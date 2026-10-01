import { type FormEvent, useEffect } from "react";
import { ArrowRight, Clock3, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const whatsappNumber = "522441374286";
const facebookUrl = "https://www.facebook.com/profile.php?id=61594027933855&locale=es_LA";

function Contacto() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#ayuda") {
      document.getElementById("ayuda")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.hash]);

  function sendToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = [
      "Hola, Isabella Floristería. Me gustaría ponerme en contacto.",
      `Nombre: ${formData.get("nombre")}`,
      `Teléfono: ${formData.get("telefono") || "No indicado"}`,
      `Motivo: ${formData.get("asunto")}`,
      `Mensaje: ${formData.get("mensaje")}`,
    ].join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="section-container contact-hero-inner">
          <div className="contact-hero-copy">
            <span className="contact-kicker">ESTAMOS PARA AYUDARTE</span>
            <h1>Hablemos de<br /><em>algo bonito.</em></h1>
            <p>Cuéntanos qué quieres celebrar. Te orientamos para crear un arreglo especial y coordinar cada detalle.</p>
            <a className="contact-whatsapp-cta" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={20} /> Escribir por WhatsApp <ArrowRight size={17} /></a>
          </div>
          <div className="contact-hero-note"><span className="contact-note-flower">✿</span><p>Un detalle pensado<br />con cariño cambia el día.</p><span>ISABELLA FLORISTERÍA · ATLIXCO</span></div>
        </div>
      </section>

      <section className="contact-content-section">
        <div className="section-container contact-content-grid">
          <div className="contact-details-column">
            <span className="section-label">ENCUÉNTRANOS</span>
            <h2>El primer paso<br />es saludarnos.</h2>
            <p className="contact-lead">Atendemos pedidos, ideas para eventos y consultas sobre nuestros arreglos.</p>
            <div className="contact-detail-list">
              <a className="contact-detail-card" href="tel:+522441374286"><span className="contact-detail-icon"><Phone size={20} /></span><span><small>LLÁMANOS</small><strong>244 137 4286</strong><em>Atención directa</em></span><ArrowRight size={17} /></a>
              <a className="contact-detail-card" href="https://maps.google.com/?q=Atlixco%2C+Puebla" target="_blank" rel="noreferrer"><span className="contact-detail-icon"><MapPin size={20} /></span><span><small>ESTAMOS EN</small><strong>Atlixco, Puebla</strong><em>Ver ubicación en mapas</em></span><ArrowRight size={17} /></a>
              <div className="contact-detail-card"><span className="contact-detail-icon"><Clock3 size={20} /></span><span><small>HORARIO DE ATENCIÓN</small><strong>Lunes a sábado</strong><em>9:00 a. m. – 7:00 p. m.</em></span></div>
            </div>
            <div className="contact-social-row"><a href={facebookUrl} target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.4 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6H17V3.5c-.4-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.5V13h2.8v8h3.1Z" /></svg> Síguenos en Facebook</a><Link to="/contacto#ayuda">Solicitar una cotización <ArrowRight size={16} /></Link></div>
          </div>

          <div className="contact-form-card" id="ayuda" tabIndex={-1}>
            <span className="contact-form-overline"><MessageCircle size={16} /> RESPUESTA DIRECTA</span>
            <h2>¿En qué podemos ayudarte?</h2>
            <p>Completa el mensaje y se abrirá WhatsApp para que puedas enviárnoslo.</p>
            <form className="contact-form" onSubmit={sendToWhatsApp}>
              <div className="form-row">
                <div className="form-group"><label htmlFor="nombre">Tu nombre</label><input id="nombre" name="nombre" type="text" placeholder="¿Cómo te llamas?" autoComplete="name" required /></div>
                <div className="form-group"><label htmlFor="telefono">Teléfono <span>(opcional)</span></label><input id="telefono" name="telefono" type="tel" placeholder="Tu número" autoComplete="tel" /></div>
              </div>
              <div className="form-group"><label htmlFor="asunto">¿Qué necesitas?</label><select id="asunto" name="asunto" defaultValue="" required><option value="" disabled>Elige un motivo</option><option>Cotizar un arreglo</option><option>Diseño para evento</option><option>Consultar una entrega</option><option>Información sobre flores</option><option>Otro motivo</option></select></div>
              <div className="form-group"><label htmlFor="mensaje">Cuéntanos un poco más</label><textarea id="mensaje" name="mensaje" rows={5} minLength={8} placeholder="Describe tu idea, ocasión o pregunta…" required /></div>
              <button type="submit" className="contact-send-button"><Send size={17} /> Continuar por WhatsApp</button>
              <small className="contact-form-footnote">Tu mensaje se enviará a Isabella Floristería por WhatsApp.</small>
            </form>
          </div>
        </div>
      </section>

      <section className="contact-bottom-cta"><div className="section-container"><span>¿Aún explorando ideas?</span><p>Conoce nuestros trabajos y encuentra inspiración para tu próximo detalle.</p><Link to="/trabajos">Ver nuestros trabajos <ArrowRight size={17} /></Link></div></section>
    </main>
  );
}

export default Contacto;

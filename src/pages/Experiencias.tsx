import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Camera, Heart, LogOut, MessageCircle, Send, ShieldCheck, Star, Upload, X } from "lucide-react";
import {
  getCustomerReviews,
  isSupabaseConfigured,
  replyToCustomerReview,
  signInFlorist,
  submitCustomerReview,
  type CustomerReview,
} from "../services/supabase";

const ratingLabels = ["", "Necesita mejorar", "Regular", "Bueno", "Muy bueno", "¡Excelente!"];

function Experiencias() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [savingReply, setSavingReply] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    if (!isSupabaseConfigured) {
      setLoading(false);
      setLoadError("La publicación pública se activará al conectar la base de datos de la floristería.");
      return () => { active = false; };
    }
    void getCustomerReviews()
      .then((items) => { if (active) setReviews(items); })
      .catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : "No se pudieron cargar las experiencias."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!photo) { setPhotoPreview(""); return; }
    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photo]);

  const ratingSummary = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    let total = 0;
    for (const review of reviews) { counts[review.rating] += 1; total += review.rating; }
    return { counts, average: reviews.length ? total / reviews.length : 0 };
  }, [reviews]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");
    setFormError(false);
    if (!isSupabaseConfigured) {
      setFormError(true);
      setFormMessage("Aún falta conectar la base de datos para que los aportes sean públicos.");
      return;
    }
    if (!photo || rating < 1) {
      setFormError(true);
      setFormMessage("Elige una foto del ramo y selecciona una puntuación con estrellas.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await submitCustomerReview({ name, rating, comment, photo });
      setReviews((previous) => [created, ...previous]);
      setName(""); setRating(0); setComment(""); setPhoto(null);
      setFormMessage("¡Gracias! Tu foto y experiencia ya están publicadas.");
    } catch (error) {
      setFormError(true);
      setFormMessage(error instanceof Error ? error.message : "No se pudo enviar tu experiencia. Intenta de nuevo.");
    } finally { setSubmitting(false); }
  }

  async function handleFloristLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAdminMessage(""); setAdminError(false);
    try {
      setAdminToken(await signInFlorist(adminEmail, adminPassword));
      setAdminPassword(""); setAdminMessage("Sesión de floristería iniciada. Ya puedes responder a las reseñas.");
    } catch (error) {
      setAdminError(true); setAdminMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    }
  }

  async function handleReply(id: number) {
    const reply = replyDrafts[id]?.trim();
    if (!adminToken || !reply) return;
    setSavingReply(id); setAdminMessage(""); setAdminError(false);
    try {
      await replyToCustomerReview(id, reply, adminToken);
      setReviews((previous) => previous.map((review) => review.id === id ? { ...review, florist_reply: reply } : review));
      setReplyDrafts((previous) => ({ ...previous, [id]: "" }));
      setAdminMessage("Respuesta publicada.");
    } catch (error) {
      setAdminError(true); setAdminMessage(error instanceof Error ? error.message : "No se pudo publicar la respuesta.");
    } finally { setSavingReply(null); }
  }

  return (
    <main className="experiences-page">
      <section className="page-header experiences-header">
        <div className="section-container">
          <span className="section-label">HISTORIAS DE NUESTRA COMUNIDAD</span>
          <h1>Experiencias</h1>
          <p>Fotos reales, momentos especiales y palabras de quienes recibieron flores de Isabella.</p>
          <a className="experiences-header-cta" href="#share-experience"><Camera size={18} /> Comparte tu experiencia</a>
        </div>
      </section>

      <section className="satisfaction-section" aria-labelledby="satisfaction-heading">
        <div className="section-container satisfaction-layout">
          <div className="satisfaction-summary">
            <span className="section-label">OPINIONES DE CLIENTES</span>
            <h2 id="satisfaction-heading">La alegría de regalar flores</h2>
            {reviews.length ? <>
              <div className="average-rating"><strong>{ratingSummary.average.toFixed(1)}</strong><div><div className="experience-rating" aria-label={`${ratingSummary.average.toFixed(1)} de 5 estrellas`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={20} fill={star <= Math.round(ratingSummary.average) ? "currentColor" : "none"} />)}</div><span>Basado en {reviews.length} {reviews.length === 1 ? "experiencia" : "experiencias"}</span></div></div>
              <p className="satisfaction-callout">{Math.round(((ratingSummary.counts[4] + ratingSummary.counts[5]) / reviews.length) * 100)}% de nuestros clientes califican su experiencia con 4 o 5 estrellas.</p>
            </> : <p className="satisfaction-callout">Sé la primera persona en compartir cómo fue recibir un ramo de Isabella.</p>}
          </div>
          <div className="rating-chart" aria-label="Distribución de puntuaciones">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingSummary.counts[stars];
              const width = reviews.length ? `${(count / reviews.length) * 100}%` : "0%";
              return <div className="rating-chart-row" key={stars}><span>{stars} <Star size={14} fill="currentColor" /></span><div className="rating-track"><div className="rating-fill" style={{ width }} /></div><b>{count}</b></div>;
            })}
          </div>
        </div>
      </section>

      <section className="share-experience-section" id="share-experience">
        <div className="section-container share-experience-inner">
          <div className="share-experience-intro">
            <span className="share-icon"><Camera size={27} /></span>
            <span className="section-label">TU VOZ Y TU FOTO HACEN LA DIFERENCIA</span>
            <h2>¿Ya recibiste tu ramo?</h2>
            <p>Cuéntale a nuestra comunidad cómo fue tu experiencia. Comparte una foto del arreglo ya entregado, califica nuestro trabajo y deja tu comentario.</p>
            <div className="share-features"><span><Camera size={17} /> Foto de tu ramo</span><span><Star size={17} /> Puntuación de 1 a 5</span><span><MessageCircle size={17} /> Tu comentario</span></div>
          </div>

          <form className="review-form" onSubmit={handleSubmit}>
            <h3>Comparte tu experiencia</h3>
            <p className="review-form-hint">Todos los campos son necesarios. Tu aporte será visible para todas las personas que visiten esta página.</p>
            <label className="review-field">Tu nombre<input required minLength={2} maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="¿Cómo te llamas?" autoComplete="name" /></label>
            <fieldset className="star-picker"><legend>¿Cómo calificas nuestro trabajo?</legend><div role="radiogroup" aria-label="Puntuación de 1 a 5 estrellas">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" role="radio" aria-checked={rating === star} aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}: ${ratingLabels[star]}`} className={star <= rating ? "star-choice selected" : "star-choice"} onClick={() => setRating(star)}><Star size={32} fill={star <= rating ? "currentColor" : "none"} /></button>)}</div><span>{rating ? ratingLabels[rating] : "Selecciona de 1 a 5 estrellas"}</span></fieldset>
            <label className="review-field">Tu comentario<textarea required minLength={8} maxLength={1200} rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="¿Qué te pareció el ramo, la atención y la entrega?" /></label>
            <div className="review-field"><span className="review-label">Foto del ramo entregado</span><label className="photo-upload" htmlFor="review-photo"><Upload size={20} /><span>{photo ? photo.name : "Elige una foto JPG, PNG o WEBP"}</span><small>Máximo 5 MB</small></label><input className="visually-hidden-input" id="review-photo" type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => setPhoto(event.target.files?.[0] || null)} />{photoPreview && <div className="photo-preview"><img src={photoPreview} alt="Vista previa de tu ramo" /><button type="button" aria-label="Quitar foto" onClick={() => setPhoto(null)}><X size={18} /></button></div>}</div>
            <button className="review-submit" type="submit" disabled={submitting}><Send size={18} />{submitting ? "Publicando tu experiencia…" : "Publicar mi experiencia"}</button>
            {formMessage && <p className={formError ? "review-status error" : "review-status success"} role="status">{formMessage}</p>}
          </form>
        </div>
      </section>

      <section className="section published-reviews-section">
        <div className="section-container">
          <div className="section-heading reviews-heading"><div><span className="section-label">FOTOS Y OPINIONES REALES</span><h2>Lo que comparte nuestra comunidad</h2></div><button type="button" className="florist-access-button" onClick={() => setAdminOpen((open) => !open)}><ShieldCheck size={17} /> Responder como floristería</button></div>
          {adminOpen && <div className="florist-panel"><div><ShieldCheck size={21} /><p><strong>Acceso de la floristería</strong><span>Inicia sesión para responder públicamente a las experiencias.</span></p></div>{adminToken ? <button type="button" className="florist-logout" onClick={() => { setAdminToken(""); setAdminMessage("Sesión cerrada."); }}><LogOut size={16} /> Cerrar sesión</button> : <form onSubmit={handleFloristLogin}><input type="email" required aria-label="Correo de la floristería" placeholder="Correo de acceso" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} /><input type="password" required aria-label="Contraseña de la floristería" placeholder="Contraseña" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} /><button type="submit">Iniciar sesión</button></form>}{adminMessage && <p className={adminError ? "review-status error" : "review-status success"} role="status">{adminMessage}</p>}</div>}
          {!isSupabaseConfigured && <div className="reviews-notice">{loadError}</div>}
          {loading ? <p className="reviews-empty">Cargando experiencias…</p> : reviews.length ? <div className="experiences-grid">{reviews.map((review) => <article className="experience-card" key={review.id}><div className="experience-image-placeholder"><img src={review.image_url} alt={`Ramo compartido por ${review.name}`} loading="lazy" /></div><div className="experience-info"><div className="experience-rating" aria-label={`${review.rating} de 5 estrellas`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill={star <= review.rating ? "currentColor" : "none"} />)}</div><p className="review-comment">{review.comment}</p><div className="review-byline"><strong>{review.name}</strong><time dateTime={review.created_at}>{new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(review.created_at))}</time></div>{review.florist_reply && <div className="florist-reply"><strong>Respuesta de Isabella Flores</strong><p>{review.florist_reply}</p></div>}{adminToken && <div className="reply-editor"><textarea aria-label={`Respuesta para ${review.name}`} rows={3} maxLength={1200} placeholder={review.florist_reply ? "Actualizar respuesta pública…" : "Escribe una respuesta pública…"} value={replyDrafts[review.id] ?? review.florist_reply ?? ""} onChange={(event) => setReplyDrafts((previous) => ({ ...previous, [review.id]: event.target.value }))} /><button type="button" disabled={savingReply === review.id || !(replyDrafts[review.id] ?? review.florist_reply ?? "").trim()} onClick={() => void handleReply(review.id)}><Send size={15} />{savingReply === review.id ? "Publicando…" : "Publicar respuesta"}</button></div>}</div></article>)}</div> : <div className="reviews-empty"><Heart size={25} /><p>Aún no hay experiencias publicadas. ¡Tu foto y tu opinión pueden ser las primeras!</p></div>}
          {loadError && isSupabaseConfigured && <p className="review-status error" role="status">No se pudieron cargar las reseñas: {loadError}</p>}
        </div>
      </section>
    </main>
  );
}

export default Experiencias;

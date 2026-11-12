import { type CSSProperties, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Heart, MessageCircle, Send, Star, Upload, X } from "lucide-react";
import {
  getCustomerReviews,
  getCustomerReviewLikes,
  isSupabaseConfigured,
  likeCustomerReview,
  submitCustomerReview,
  type CustomerReview,
} from "../services/supabase";

const ratingLabels = ["", "Necesita mejorar", "Regular", "Bueno", "Muy bueno", "¡Excelente!"];
const reviewVisitorKey = "isabella-review-visitor-id";

function getReviewVisitorId() {
  try {
    const existing = window.localStorage.getItem(reviewVisitorKey);
    if (existing) return existing;
  } catch {
    // Keep likes available for this visit when browser storage is unavailable.
  }

  const visitorId = window.crypto?.randomUUID?.()
    ?? "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
      const value = Math.floor(Math.random() * 16);
      return (character === "x" ? value : (value & 0x3) | 0x8).toString(16);
    });

  try {
    window.localStorage.setItem(reviewVisitorKey, visitorId);
  } catch {
    // The generated ID still works for this visit without browser storage.
  }
  return visitorId;
}

type CustomerReviewPostProps = {
  review: CustomerReview;
  likeCount: number;
  isLiked: boolean;
  likePending: boolean;
  onLike: () => void;
};

function CustomerReviewPost({ review, likeCount, isLiked, likePending, onLike }: CustomerReviewPostProps) {
  const photoRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null);
  const [burst, setBurst] = useState<{ id: number; x: number; y: number; rotate: number } | null>(null);

  useEffect(() => {
    if (!burst) return;
    const timer = window.setTimeout(() => setBurst(null), 780);
    return () => window.clearTimeout(timer);
  }, [burst]);

  function triggerPhotoLike(x: number, y: number) {
    setBurst({ id: Date.now(), x, y, rotate: Math.random() * 30 - 15 });
    onLike();
  }

  function handlePhotoPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const point = { time: Date.now(), x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    const previous = lastTap.current;
    if (previous && point.time - previous.time < 360 && Math.hypot(point.x - previous.x, point.y - previous.y) < 56) {
      lastTap.current = null;
      triggerPhotoLike(point.x, point.y);
      return;
    }
    lastTap.current = point;
  }

  function handlePhotoKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const bounds = photoRef.current?.getBoundingClientRect();
    triggerPhotoLike((bounds?.width ?? 0) / 2, (bounds?.height ?? 0) / 2);
  }

  const formattedDate = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(review.created_at));

  return (
    <article className="experience-card instagram-review-card">
      <header className="instagram-post-header">
        <span className="instagram-review-avatar" aria-hidden="true">{review.name.trim().charAt(0).toLocaleUpperCase("es-MX")}</span>
        <div className="instagram-review-author"><strong>{review.name}</strong><span>Comunidad Isabella</span></div>
      </header>
      <div
        ref={photoRef}
        className="experience-image-placeholder instagram-review-image"
        role="button"
        tabIndex={0}
        aria-label={`Da doble toque para indicar que te gusta la foto del ramo de ${review.name}`}
        onPointerUp={handlePhotoPointerUp}
        onKeyDown={handlePhotoKeyDown}
      >
        <img src={review.image_url} alt={`Ramo compartido por ${review.name}`} loading="lazy" draggable={false} />
        {burst && <div key={burst.id} className="instagram-heart-burst" style={{ left: burst.x, top: burst.y }} aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
            const particleStyle = {
              "--particle-x": `${Math.cos(angle) * 58}px`,
              "--particle-y": `${Math.sin(angle) * 58}px`,
            } as CSSProperties;
            return <i key={index} className="instagram-heart-particle" style={particleStyle} />;
          })}
          <Heart className="instagram-burst-heart" size={96} fill="currentColor" style={{ rotate: `${burst.rotate}deg` }} />
        </div>}
      </div>
      <div className="experience-info instagram-post-info">
        <div className="instagram-post-actions">
          <button className={isLiked ? "instagram-like-button is-liked" : "instagram-like-button"} type="button" onClick={onLike} disabled={likePending || isLiked} aria-label={isLiked ? "Te gusta esta reseña" : "Me gusta esta reseña"} aria-pressed={isLiked}>
            <Heart size={25} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <span className="experience-rating" aria-label={`${review.rating} de 5 estrellas`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill={star <= review.rating ? "currentColor" : "none"} />)}</span>
        </div>
        <strong key={likeCount} className="instagram-like-count" aria-live="polite" aria-atomic="true">{new Intl.NumberFormat("es-MX").format(likeCount)} me gusta</strong>
        <p className="review-comment instagram-review-caption"><strong>{review.name}</strong> {review.comment}</p>
        <time className="instagram-post-date" dateTime={review.created_at}>{formattedDate}</time>
        {review.florist_reply && <div className="florist-reply"><strong>Respuesta de Isabella Florister&#237;a</strong><p>{review.florist_reply}</p></div>}
      </div>
    </article>
  );
}

function Experiencias() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [reviewLikeCounts, setReviewLikeCounts] = useState<Record<number, number>>({});
  const [likedReviewIds, setLikedReviewIds] = useState<Set<number>>(() => new Set());
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<number>>(() => new Set());
  const [likesLoading, setLikesLoading] = useState(true);
  const [likeError, setLikeError] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    let active = true;
    const currentVisitorId = getReviewVisitorId();
    setVisitorId(currentVisitorId);
    if (!isSupabaseConfigured) {
      setLoading(false);
      setLikesLoading(false);
      setLoadError("La publicaci\u00F3n p\u00FAblica se activar\u00E1 al conectar la base de datos de la florister\u00EDa.");
      return () => { active = false; };
    }
    void getCustomerReviews()
      .then((items) => { if (active) setReviews(items); })
      .catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : "No se pudieron cargar las experiencias."); })
      .finally(() => { if (active) setLoading(false); });
    void getCustomerReviewLikes()
      .then((likes) => {
        if (!active) return;
        const counts: Record<number, number> = {};
        const likedIds = new Set<number>();
        likes.forEach((like) => {
          counts[like.review_id] = (counts[like.review_id] ?? 0) + 1;
          if (like.visitor_id === currentVisitorId) likedIds.add(like.review_id);
        });
        setReviewLikeCounts(counts);
        setLikedReviewIds(likedIds);
      })
      .catch(() => { if (active) setLikeError("No se pudieron cargar los me gusta de las rese\u00F1as."); })
      .finally(() => { if (active) setLikesLoading(false); });
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
    const satisfaction = reviews.length ? Math.round(((counts[4] + counts[5]) / reviews.length) * 100) : 0;
    return { counts, average: reviews.length ? total / reviews.length : 0, satisfaction };
  }, [reviews]);

  async function handleLikeReview(reviewId: number) {
    if (!isSupabaseConfigured || !visitorId || likedReviewIds.has(reviewId) || pendingLikeIds.has(reviewId)) return;
    setLikeError("");
    setLikedReviewIds((current) => new Set(current).add(reviewId));
    setReviewLikeCounts((current) => ({ ...current, [reviewId]: (current[reviewId] ?? 0) + 1 }));
    setPendingLikeIds((current) => new Set(current).add(reviewId));

    try {
      const inserted = await likeCustomerReview(reviewId, visitorId);
      if (!inserted) {
        setReviewLikeCounts((current) => ({ ...current, [reviewId]: Math.max(0, (current[reviewId] ?? 1) - 1) }));
      }
    } catch {
      setLikedReviewIds((current) => {
        const next = new Set(current);
        next.delete(reviewId);
        return next;
      });
      setReviewLikeCounts((current) => ({ ...current, [reviewId]: Math.max(0, (current[reviewId] ?? 1) - 1) }));
      setLikeError("No se pudo guardar el me gusta. Comprueba que la tabla de likes esté habilitada en Supabase.");
    } finally {
      setPendingLikeIds((current) => {
        const next = new Set(current);
        next.delete(reviewId);
        return next;
      });
    }
  }

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
      setFormMessage("¡Tu comentario y foto se publicaron correctamente! Gracias por compartir tu experiencia.");
    } catch (error) {
      setFormError(true);
      setFormMessage(error instanceof Error ? error.message : "No se pudo enviar tu experiencia. Intenta de nuevo.");
    } finally { setSubmitting(false); }
  }

  return (
    <main className="experiences-page">
      <section className="page-header experiences-header">
        <div className="section-container">
          <span className="section-label">HISTORIAS DE NUESTRA COMUNIDAD</span>
          <h1>Experiencias</h1>
          <p>Fotos reales, momentos especiales y palabras de quienes recibieron flores de Isabella Floristería.</p>
          <a className="experiences-header-cta" href="#share-experience"><Camera size={18} /> Comparte tu experiencia</a>
        </div>
      </section>

      <section className="satisfaction-section" aria-labelledby="satisfaction-heading">
        <div className="section-container satisfaction-layout">
          <div className="satisfaction-summary">
            <span className="section-label">OPINIONES DE CLIENTES</span>
            <h2 id="satisfaction-heading">La satisfacción de nuestros clientes</h2>
            {loading ? <p className="satisfaction-callout">Cargando las calificaciones de nuestros clientes…</p> : reviews.length ? <>
              <div className="average-rating"><strong>{ratingSummary.average.toFixed(1)}</strong><div><div className="experience-rating" aria-label={`${ratingSummary.average.toFixed(1)} de 5 estrellas`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={20} fill={star <= Math.round(ratingSummary.average) ? "currentColor" : "none"} />)}</div><span>Basado en {reviews.length} {reviews.length === 1 ? "experiencia" : "experiencias"}</span></div></div>
              <div className="satisfaction-gauge-row">
                <div className="satisfaction-gauge" role="img" aria-label={`${ratingSummary.satisfaction}% de nuestros clientes están satisfechos con nuestro trabajo`}>
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="satisfaction-gauge-track" cx="60" cy="60" r="48" pathLength="100" />
                    <circle className="satisfaction-gauge-value" cx="60" cy="60" r="48" pathLength="100" strokeDasharray={`${ratingSummary.satisfaction} 100`} />
                  </svg>
                  <strong>{ratingSummary.satisfaction}%</strong>
                </div>
                <div className="satisfaction-gauge-copy">
                  <p><strong>de nuestros clientes están satisfechos con nuestro trabajo.</strong></p>
                  <span>Consideramos satisfechas las calificaciones de 4 y 5 estrellas. Basado en {reviews.length} {reviews.length === 1 ? "opinión" : "opiniones"}.</span>
                </div>
              </div>
            </> : <p className="satisfaction-callout">Aún no hay calificaciones para calcular la satisfacción. Sé la primera persona en compartir su experiencia.</p>}
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

      <section className="section published-reviews-section">
        <div className="section-container">
          <div className="section-heading reviews-heading"><div><span className="section-label">FOTOS Y OPINIONES REALES</span><h2>Lo que comparte nuestra comunidad</h2></div></div>
          {!isSupabaseConfigured && <div className="reviews-notice">{loadError}</div>}
          {likeError && <p className="review-status error" role="status">{likeError}</p>}
          {loading ? <p className="reviews-empty">Cargando experiencias…</p> : reviews.length ? <div className="experiences-grid">{reviews.map((review) => <CustomerReviewPost key={review.id} review={review} likeCount={reviewLikeCounts[review.id] ?? 0} isLiked={likedReviewIds.has(review.id)} likePending={pendingLikeIds.has(review.id) || likesLoading || !visitorId || !isSupabaseConfigured} onLike={() => void handleLikeReview(review.id)} />)}</div> : <div className="reviews-empty"><Heart size={25} /><p>Aún no hay experiencias publicadas. ¡Tu foto y tu opinión pueden ser las primeras!</p></div>}
          {loadError && isSupabaseConfigured && <p className="review-status error" role="status">No se pudieron cargar las reseñas: {loadError}</p>}
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
    </main>
  );
}

export default Experiencias;

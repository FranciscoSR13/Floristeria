import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Flower2, Pencil, RefreshCw, Star, Trash2, X } from "lucide-react";
import {
  deleteCustomerReview,
  getCustomerReviews,
  replyToCustomerReview,
  signInFlorist,
  type CustomerReview,
} from "../services/supabase";

type ReviewFilter = "all" | "pending" | "answered";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  const pendingCount = reviews.filter((review) => !review.florist_reply).length;
  const answeredCount = reviews.length - pendingCount;
  const filteredReviews = reviews.filter((review) => {
    if (reviewFilter === "pending") return !review.florist_reply;
    if (reviewFilter === "answered") return Boolean(review.florist_reply);
    return true;
  });

  async function loadReviews() {
    setLoadingReviews(true);
    setError("");
    try {
      setReviews(await getCustomerReviews());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las experiencias.");
    } finally {
      setLoadingReviews(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      setToken(await signInFlorist(email, password));
      setPassword("");
      setMessage("Sesi\u00F3n iniciada correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesi\u00F3n.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(event: FormEvent<HTMLFormElement>, reviewId: number) {
    event.preventDefault();
    if (!token) {
      setError("La sesi\u00F3n de administraci\u00F3n ha expirado.");
      return;
    }
    const reply = replies[reviewId]?.trim();
    if (!reply) {
      setError("Escribe una respuesta antes de publicarla.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await replyToCustomerReview(reviewId, reply, token);
      setReplies((current) => ({ ...current, [reviewId]: "" }));
      setEditingReviewId(null);
      setMessage("Respuesta guardada correctamente.");
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la respuesta.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(review: CustomerReview) {
    if (!token) {
      setError("La sesi\u00F3n de administraci\u00F3n ha expirado.");
      return;
    }
    const confirmed = window.confirm(`\u00BFEliminar la experiencia de ${review.name}? Esta acci\u00F3n no se puede deshacer.`);
    if (!confirmed) return;

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const photoDeleted = await deleteCustomerReview(review.id, review.image_url, token);
      setReviews((current) => current.filter((item) => item.id !== review.id));
      setEditingReviewId((current) => current === review.id ? null : current);
      setReplies((current) => { const next = { ...current }; delete next[review.id]; return next; });
      setMessage(photoDeleted
        ? "Experiencia eliminada correctamente."
        : "Experiencia eliminada; no se pudo borrar el archivo de foto.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la experiencia.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setReviews([]);
    setReplies({});
    setEmail("");
    setPassword("");
    setError("");
    setMessage("");
    setReviewFilter("all");
    setEditingReviewId(null);
  }

  function cancelReplyEdit(reviewId: number) {
    setEditingReviewId(null);
    setReplies((current) => {
      const next = { ...current };
      delete next[reviewId];
      return next;
    });
  }

  useEffect(() => {
    if (token) void loadReviews();
  }, [token]);

  if (!token) {
    return (
      <main className="admin-page admin-login-page">
        <section className="admin-login">
          <div className="admin-login-card">
            <div className="admin-login-mark" aria-hidden="true"><Flower2 size={25} /></div>
            <span className="admin-eyebrow">ISABELLA FLORISTERIA · ADMINISTRACI&#211;N</span>
            <h1>Tu espacio de<br /><em>atenci&#243;n.</em></h1>
            <p>Inicia sesi&#243;n para revisar las experiencias y responder personalmente a tus clientes.</p>
            <form onSubmit={handleLogin} className="admin-form">
              <label htmlFor="admin-email">Correo electr&#243;nico</label>
              <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@tufloristeria.com" autoComplete="username" required />
              <label htmlFor="admin-password">Contrase&#241;a</label>
              <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tu contrase&#241;a" autoComplete="current-password" required />
              {error && <p className="admin-error" role="alert">{error}</p>}
              <button type="submit" disabled={loading}>{loading ? "Iniciando sesi&#243;n..." : "Iniciar sesi&#243;n"}</button>
            </form>
            <small className="admin-login-foot">Acceso privado para el equipo de Isabella</small>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span className="admin-eyebrow">ISABELLA FLORISTERIA · PANEL DE CONTROL</span>
          <h1>Experiencias de clientes</h1>
          <p>Lee cada historia y mant&#233;n la conversaci&#243;n con quienes nos eligen.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-refresh" onClick={() => void loadReviews()} disabled={loadingReviews} aria-label="Actualizar experiencias">
            <RefreshCw size={15} className={loadingReviews ? "admin-refresh-spinning" : ""} /> Actualizar
          </button>
          <span className="admin-session"><i /> Sesi&#243;n activa</span>
          <button type="button" className="admin-logout" onClick={handleLogout}>Cerrar sesi&#243;n</button>
        </div>
      </section>

      <section className="admin-summary" aria-label="Resumen de experiencias">
        <span className="admin-summary-icon"><Flower2 size={20} /></span>
        <div><strong>{reviews.length}</strong><span>{reviews.length === 1 ? "experiencia recibida" : "experiencias recibidas"}</span></div>
        <span className="admin-summary-note">{pendingCount} pendientes · {answeredCount} respondidas</span>
      </section>

      <nav className="admin-review-filters" aria-label="Filtrar experiencias">
        <button type="button" className={reviewFilter === "all" ? "is-active" : ""} aria-pressed={reviewFilter === "all"} onClick={() => setReviewFilter("all")}>Todas <span>{reviews.length}</span></button>
        <button type="button" className={reviewFilter === "pending" ? "is-active" : ""} aria-pressed={reviewFilter === "pending"} onClick={() => setReviewFilter("pending")}>Pendientes <span>{pendingCount}</span></button>
        <button type="button" className={reviewFilter === "answered" ? "is-active" : ""} aria-pressed={reviewFilter === "answered"} onClick={() => setReviewFilter("answered")}>Respondidas <span>{answeredCount}</span></button>
      </nav>

      {message && <p className="admin-message" role="status">{message}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}
      {loadingReviews ? (
        <p className="admin-loading" role="status">Cargando experiencias...</p>
      ) : reviews.length === 0 ? (
        <section className="admin-empty"><Flower2 size={28} aria-hidden="true" /><h2>A&#250;n no hay experiencias</h2><p>Cuando un cliente comparta su historia, aparecer&#225; aqu&#237;.</p></section>
      ) : filteredReviews.length === 0 ? (
        <section className="admin-empty"><Flower2 size={28} aria-hidden="true" /><h2>No hay experiencias en esta secci&#243;n</h2><p>Prueba otro filtro para consultar las rese&#241;as.</p></section>
      ) : (
        <section className="admin-reviews" aria-label="Experiencias compartidas">
          {filteredReviews.map((review) => {
            const isEditingReply = editingReviewId === review.id;
            const showReplyForm = !review.florist_reply || isEditingReply;
            return (
              <article className="admin-review-card" key={review.id}>
                <div className="admin-review-image"><img src={review.image_url} alt={`Experiencia compartida por ${review.name}`} loading="lazy" /></div>
                <div className="admin-review-content">
                  <div className="admin-review-top">
                    <div><h2>{review.name}</h2><span>{new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(review.created_at))}</span></div>
                    <div className="admin-rating" aria-label={`${review.rating} de 5 estrellas`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < review.rating ? "currentColor" : "none"} />)}</div>
                  </div>
                  <p className="admin-review-comment">{review.comment}</p>
                  {review.florist_reply && !isEditingReply && (
                    <div className="admin-existing-reply">
                      <div><strong>Respuesta de la florister&#237;a</strong><p>{review.florist_reply}</p></div>
                      <div className="admin-review-actions">
                        <button type="button" className="admin-edit-button" onClick={() => { setReplies((current) => ({ ...current, [review.id]: review.florist_reply ?? "" })); setEditingReviewId(review.id); }} disabled={loading}><Pencil size={14} /> Editar respuesta</button>
                        <button type="button" className="admin-delete-button" onClick={() => void handleDelete(review)} disabled={loading}><Trash2 size={14} /> Eliminar rese&#241;a</button>
                      </div>
                    </div>
                  )}
                  {showReplyForm && (
                    <form className="admin-reply-form" onSubmit={(event) => void handleReply(event, review.id)}>
                      <label htmlFor={`reply-${review.id}`}>{review.florist_reply ? "Actualizar respuesta" : "Responder al cliente"}</label>
                      <textarea id={`reply-${review.id}`} value={replies[review.id] ?? review.florist_reply ?? ""} onChange={(event) => setReplies((current) => ({ ...current, [review.id]: event.target.value }))} placeholder="Escribe una respuesta amable para el cliente..." rows={4} maxLength={1000} required />
                      <div className="admin-reply-actions">
                        <button type="submit" disabled={loading}>{loading ? "Guardando..." : review.florist_reply ? "Guardar cambios" : "Publicar respuesta"}</button>
                        {isEditingReply && <button type="button" className="admin-cancel-edit" onClick={() => cancelReplyEdit(review.id)} disabled={loading}><X size={14} /> Cancelar</button>}
                      </div>
                    </form>
                  )}
                  {!review.florist_reply && <div className="admin-review-actions admin-pending-actions"><button type="button" className="admin-delete-button" onClick={() => void handleDelete(review)} disabled={loading}><Trash2 size={14} /> Eliminar rese&#241;a</button></div>}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

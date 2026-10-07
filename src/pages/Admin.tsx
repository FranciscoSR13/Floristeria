import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getCustomerReviews,
  replyToCustomerReview,
  signInFlorist,
  type CustomerReview,
} from "../services/supabase";

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

  async function loadReviews() {
    setLoadingReviews(true);
    setError("");

    try {
      const data = await getCustomerReviews();
      setReviews(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las experiencias.",
      );
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
      const accessToken = await signInFlorist(email, password);

      setToken(accessToken);
      setPassword("");
      setMessage("Sesión iniciada correctamente.");

      await loadReviews();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(
    event: FormEvent<HTMLFormElement>,
    reviewId: number,
  ) {
    event.preventDefault();

    if (!token) {
      setError("La sesión de administración ha expirado.");
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

      setReplies((current) => ({
        ...current,
        [reviewId]: "",
      }));

      setMessage("Respuesta publicada correctamente.");

      await loadReviews();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo publicar la respuesta.",
      );
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
  }

  useEffect(() => {
    if (token) {
      void loadReviews();
    }
  }, [token]);

  if (!token) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <div className="admin-login-card">
            <span className="admin-eyebrow">Administración</span>

            <h1>Panel de floristería</h1>

            <p>
              Inicia sesión para administrar las experiencias y responder
              a tus clientes.
            </p>

            <form onSubmit={handleLogin} className="admin-form">
              <label htmlFor="admin-email">Correo electrónico</label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Correo de administración"
                required
              />

              <label htmlFor="admin-password">Contraseña</label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contraseña"
                required
              />

              {error && (
                <p className="admin-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span className="admin-eyebrow">Administración</span>

          <h1>Experiencias de clientes</h1>

          <p>
            Revisa los comentarios y responde a las personas que han
            compartido su experiencia.
          </p>
        </div>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </section>

      {message && (
        <p className="admin-message" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {loadingReviews ? (
        <p className="admin-loading">Cargando experiencias...</p>
      ) : reviews.length === 0 ? (
        <section className="admin-empty">
          <h2>Aún no hay experiencias</h2>
          <p>
            Cuando un cliente comparta una experiencia, aparecerá aquí.
          </p>
        </section>
      ) : (
        <section className="admin-reviews">
          {reviews.map((review) => (
            <article className="admin-review-card" key={review.id}>
              <div className="admin-review-image">
                <img
                  src={review.image_url}
                  alt={`Experiencia compartida por ${review.name}`}
                />
              </div>

              <div className="admin-review-content">
                <div className="admin-review-top">
                  <div>
                    <h2>{review.name}</h2>

                    <span>
                      {new Intl.DateTimeFormat("es-MX", {
                        dateStyle: "medium",
                      }).format(new Date(review.created_at))}
                    </span>
                  </div>

                  <div
                    className="admin-rating"
                    aria-label={`${review.rating} de 5 estrellas`}
                  >
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                </div>

                <p className="admin-review-comment">
                  {review.comment}
                </p>

                {review.florist_reply ? (
                  <div className="admin-existing-reply">
                    <strong>Respuesta de la floristería</strong>

                    <p>{review.florist_reply}</p>
                  </div>
                ) : (
                  <form
                    className="admin-reply-form"
                    onSubmit={(event) =>
                      void handleReply(event, review.id)
                    }
                  >
                    <label htmlFor={`reply-${review.id}`}>
                      Responder al cliente
                    </label>

                    <textarea
                      id={`reply-${review.id}`}
                      value={replies[review.id] ?? ""}
                      onChange={(event) =>
                        setReplies((current) => ({
                          ...current,
                          [review.id]: event.target.value,
                        }))
                      }
                      placeholder="Escribe una respuesta amable para el cliente..."
                      rows={4}
                      maxLength={1000}
                      required
                    />

                    <button type="submit" disabled={loading}>
                      {loading ? "Publicando..." : "Publicar respuesta"}
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

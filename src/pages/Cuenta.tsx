import { useState } from "react";
import { ArrowRight, Check, Link2, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabaseClient } from "../services/supabaseClient";

function Cuenta() {
  const { user, loading, configured, googleEnabled, signOut } = useAuth();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <main className="account-loading"><p>Cargando tu cuenta…</p></main>;
  if (!user) return <Navigate to="/login" replace />;

  const googleLinked = user.identities?.some((identity) => identity.provider === "google") ?? false;
  const displayName = user.user_metadata.full_name || user.user_metadata.name || user.email?.split("@")[0] || "Cliente";

  async function linkGoogle() {
    if (!supabaseClient) return;
    setBusy(true); setMessage(""); setIsError(false);
    const { error } = await supabaseClient.auth.linkIdentity({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/cuenta` },
    });
    if (error) { setMessage(error.message); setIsError(true); setBusy(false); }
  }

  async function handleSignOut() {
    try { await signOut(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo cerrar la sesión."); setIsError(true); }
  }

  return (
    <main className="account-page">
      <section className="account-hero"><div className="section-container"><span className="section-label">TU ESPACIO PERSONAL</span><h1>Hola, {displayName}</h1><p>Administra tu acceso y mantén tus formas de inicio de sesión vinculadas.</p></div></section>
      <section className="account-content"><div className="section-container account-layout">
        <article className="account-profile-card"><span className="account-avatar"><UserRound size={28} /></span><span className="section-label">PERFIL</span><h2>{displayName}</h2><p><Mail size={16} />{user.email}</p><small>Cuenta creada el {new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(user.created_at))}</small><button className="account-signout" type="button" onClick={() => void handleSignOut()}><LogOut size={17} /> Cerrar sesión</button></article>
        <article className="account-links-card"><div className="account-links-heading"><span><ShieldCheck size={21} /></span><div><h2>Formas de acceso</h2><p>Conecta Google para entrar con un solo toque.</p></div></div><div className="account-provider-row"><span className="account-google-mark" aria-hidden="true">G</span><div><strong>Cuenta de Google</strong><small>{googleLinked ? "Vinculada con esta cuenta" : "Aún no está vinculada"}</small></div>{googleLinked ? <span className="account-linked"><Check size={16} /> Vinculada</span> : <button type="button" className="account-link-google" onClick={() => void linkGoogle()} disabled={busy || !configured || googleEnabled === false}><Link2 size={16} />{busy ? "Conectando…" : "Vincular Google"}</button>}</div>{message && <p className={isError ? "auth-message error" : "auth-message success"} role="status">{message}</p>}{!configured && <p className="auth-message error">Configura Supabase Auth y habilita el proveedor Google para vincular tu cuenta.</p>}{configured && googleEnabled === false && <p className="auth-message error">Google aún no está habilitado en Supabase Auth. Debe configurarse el proveedor antes de vincularlo.</p>}<p className="account-security-note">La vinculación se confirma directamente con Google. Isabella Floristería no recibe tu contraseña de Google.</p></article>
        <div className="account-next-step"><p>Cuando la tienda en línea esté lista, desde aquí también podrás revisar pedidos y guardar tus preferencias.</p><Link to="/tienda">Conocer la tienda <ArrowRight size={16} /></Link></div>
      </div></section>
    </main>
  );
}

export default Cuenta;

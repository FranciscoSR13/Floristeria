import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Heart, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabaseClient } from "../services/supabaseClient";

type LoginMode = "login" | "register";

function Login() {
  const { user, loading, configured, googleEnabled } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRecovery = searchParams.get("mode") === "recovery";
  const isForgot = searchParams.get("mode") === "forgot";
  const [mode, setMode] = useState<LoginMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  if (!loading && user && !isRecovery && !isForgot) return <Navigate to="/cuenta" replace />;

  function showMessage(text: string, isError = false) {
    setMessage(text);
    setError(isError);
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showMessage("");
    if (!supabaseClient) return showMessage("La conexión de cuentas todavía no está configurada.", true);
    setBusy(true);
    try {
      if (mode === "register") {
        const { data, error: authError } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/cuenta` },
        });
        if (authError) throw authError;
        showMessage(data.session ? "Tu cuenta ya está lista. ¡Bienvenida a Isabella Flores!" : "Revisa tu correo para confirmar la cuenta y terminar el registro.");
      } else {
        const { error: authError } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        showMessage("Sesión iniciada.");
      }
    } catch (authError) {
      showMessage(authError instanceof Error ? authError.message : "No se pudo completar el acceso.", true);
    } finally { setBusy(false); }
  }

  async function handleGoogleAuth() {
    showMessage("");
    if (!supabaseClient) return showMessage("La conexión de cuentas todavía no está configurada.", true);
    setBusy(true);
    try {
      const { error: authError } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/cuenta` },
      });
      if (authError) throw authError;
    } catch (authError) {
      showMessage(authError instanceof Error ? authError.message : "No se pudo continuar con Google.", true);
      setBusy(false);
    }
  }

  async function handleRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); showMessage("");
    if (!supabaseClient) return showMessage("La conexión de cuentas todavía no está configurada.", true);
    setBusy(true);
    try {
      const { error: authError } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?mode=recovery`,
      });
      if (authError) throw authError;
      showMessage("Si existe una cuenta con ese correo, enviaremos un enlace para cambiar la contraseña.");
    } catch (authError) {
      showMessage(authError instanceof Error ? authError.message : "No se pudo solicitar el cambio de contraseña.", true);
    } finally { setBusy(false); }
  }

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); showMessage("");
    if (!supabaseClient) return showMessage("La conexión de cuentas todavía no está configurada.", true);
    setBusy(true);
    try {
      const { error: authError } = await supabaseClient.auth.updateUser({ password: newPassword });
      if (authError) throw authError;
      await setSearchParams({});
      setNewPassword("");
      showMessage("Tu contraseña se actualizó. Ya puedes iniciar sesión.");
    } catch (authError) {
      showMessage(authError instanceof Error ? authError.message : "No se pudo actualizar la contraseña.", true);
    } finally { setBusy(false); }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-decor"><span className="auth-flower">✿</span><span>ISABELLA FLORES</span><h1>Los detalles<br />también cuentan<br /><em>tu historia.</em></h1><p>Guarda tus momentos favoritos y encuentra inspiración floral para tus ocasiones especiales.</p><span className="auth-decor-foot">ATLIXCO · PUEBLA</span></div>
        <div className="auth-card-wrap">
          <Link className="auth-back-link" to="/"><ArrowLeft size={16} /> Volver al inicio</Link>
          <div className="auth-card">
            <div className="auth-card-heading"><span className="auth-card-icon"><Heart size={19} /></span><p className="section-label">TU ESPACIO PERSONAL</p><h2>{isRecovery ? "Crea una contraseña nueva" : isForgot ? "Recupera tu acceso" : mode === "register" ? "Crea tu cuenta" : "Qué gusto verte"}</h2><p>{isRecovery ? "Elige una contraseña segura para volver a tu cuenta." : isForgot ? "Te enviaremos un enlace para cambiar tu contraseña." : mode === "register" ? "Regístrate para guardar tus datos y seguir tus pedidos." : "Inicia sesión para continuar."}</p></div>

            {isRecovery ? <form className="auth-form" onSubmit={handlePasswordUpdate}><label>Nueva contraseña<span className="auth-input-wrap"><LockKeyhole size={17} /><input type="password" autoComplete="new-password" minLength={12} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Al menos 12 caracteres" /></span></label><button className="auth-primary-button" type="submit" disabled={busy}>{busy ? "Actualizando…" : "Guardar contraseña"}<ArrowRight size={17} /></button></form> : isForgot ? <><form className="auth-form" onSubmit={handleRecovery}><label>Correo electrónico<span className="auth-input-wrap"><Mail size={17} /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" /></span></label><button className="auth-primary-button" type="submit" disabled={busy || !configured}>{busy ? "Enviando…" : "Enviar enlace de recuperación"}<ArrowRight size={17} /></button></form><p className="auth-switch"><button type="button" onClick={() => { setSearchParams({}); showMessage(""); }}>Volver al inicio de sesión</button></p></> : <>
              <button className="auth-google-button" type="button" onClick={() => void handleGoogleAuth()} disabled={busy || !configured || googleEnabled === false}><svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.4 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6C44.4 37.08 46.98 31.3 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.2a24 24 0 0 0 0 21.58l7.98-6.2Z"/><path fill="#34A853" d="M24 48c6.48 0 11.94-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.17 2.3-6.26 0-11.57-3.9-13.46-9.32l-7.98 6.2C6.51 43.62 14.62 48 24 48Z"/></svg>Continuar con Google</button>
              {configured && googleEnabled === false && <p className="auth-message error" role="status">El acceso con Google aún no está habilitado en el proveedor de Supabase.</p>}
              <div className="auth-divider"><span>o usa tu correo</span></div>
              <form className="auth-form" onSubmit={handleEmailAuth}>
                {mode === "register" && <label>Nombre<span className="auth-input-wrap"><UserRound size={17} /><input type="text" autoComplete="name" minLength={2} required value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" /></span></label>}
                <label>Correo electrónico<span className="auth-input-wrap"><Mail size={17} /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" /></span></label>
                <label>Contraseña<span className="auth-input-wrap"><LockKeyhole size={17} /><input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={mode === "register" ? 12 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "register" ? "Al menos 12 caracteres" : "Tu contraseña"} /></span></label>
                {mode === "login" && <button className="auth-forgot-button" type="button" onClick={() => { setSearchParams({ mode: "forgot" }); showMessage(""); }}>¿Olvidaste tu contraseña?</button>}
                <button className="auth-primary-button" type="submit" disabled={busy || !configured}>{busy ? "Un momento…" : mode === "register" ? "Crear mi cuenta" : "Iniciar sesión"}<ArrowRight size={17} /></button>
              </form>
              <p className="auth-switch">{mode === "register" ? "¿Ya tienes cuenta?" : "¿Primera vez por aquí?"} <button type="button" onClick={() => { setMode(mode === "register" ? "login" : "register"); showMessage(""); }}>{mode === "register" ? "Inicia sesión" : "Crea una cuenta"}</button></p>
            </>}

            {!configured && <p className="auth-message error" role="status">Para habilitar el acceso, configura las variables de Supabase y activa el proveedor Google en el panel de autenticación.</p>}
            {message && <p className={error ? "auth-message error" : "auth-message success"} role="status">{message}</p>}
          </div>
          <p className="auth-legal-note">Tu información de cuenta se administra de forma segura con Supabase Auth.</p>
        </div>
      </section>
    </main>
  );
}

export default Login;

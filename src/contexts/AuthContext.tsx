import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isGoogleProviderEnabled, supabaseClient, supabaseConfigured } from "../services/supabaseClient";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  googleEnabled: boolean | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabaseClient) {
      setLoading(false);
      return;
    }

    void isGoogleProviderEnabled().then(setGoogleEnabled).catch(() => setGoogleEnabled(null));

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    void supabaseClient.auth.getSession().then(({ data, error }) => {
      if (!error) setSession(data.session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    setSession(null);
  }

  return <AuthContext.Provider value={{ user: session?.user ?? null, loading, configured: supabaseConfigured, googleEnabled, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return value;
}

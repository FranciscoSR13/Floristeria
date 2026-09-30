import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabaseClient = supabaseConfigured && supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function isGoogleProviderEnabled(): Promise<boolean> {
  if (!supabaseUrl || !supabaseKey) return false;
  const response = await fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: supabaseKey } });
  if (!response.ok) throw new Error("No se pudo consultar la configuración de Auth.");
  const settings = await response.json() as { external?: { google?: boolean } };
  return settings.external?.google === true;
}

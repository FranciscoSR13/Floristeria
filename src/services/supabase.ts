export type CustomerReview = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image_url: string;
  florist_reply: string | null;
  created_at: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function requireConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("El formulario estará disponible cuando se conecte la base de datos de la floristería.");
  }
  return { url: supabaseUrl, key: supabaseAnonKey };
}

function publicHeaders(token?: string) {
  const { key } = requireConfig();
  return { apikey: key, Authorization: `Bearer ${token || key}` };
}

async function readError(response: Response) {
  const body = await response.text();
  try {
    const parsed = JSON.parse(body) as { message?: string; error_description?: string; error?: string };
    return parsed.message || parsed.error_description || parsed.error || "No se pudo completar la solicitud.";
  } catch {
    return body || "No se pudo completar la solicitud.";
  }
}

export async function getCustomerReviews(): Promise<CustomerReview[]> {
  const { url } = requireConfig();
  const response = await fetch(`${url}/rest/v1/customer_reviews?select=*&order=created_at.desc`, {
    headers: publicHeaders(),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<CustomerReview[]>;
}

export async function submitCustomerReview(input: {
  name: string;
  rating: number;
  comment: string;
  photo: File;
}): Promise<CustomerReview> {
  const { url } = requireConfig();
  const extByType: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const extension = extByType[input.photo.type];
  if (!extension) throw new Error("La foto debe estar en formato JPG, PNG o WEBP.");
  if (input.photo.size > 5 * 1024 * 1024) throw new Error("La foto debe pesar menos de 5 MB.");

  const objectPath = `${crypto.randomUUID()}.${extension}`;
  const upload = await fetch(`${url}/storage/v1/object/ramilletes-clientes/${objectPath}`, {
    method: "POST",
    headers: { ...publicHeaders(), "Content-Type": input.photo.type, "x-upsert": "false" },
    body: input.photo,
  });
  if (!upload.ok) throw new Error(await readError(upload));

  const photoUrl = `${url}/storage/v1/object/public/ramilletes-clientes/${objectPath}`;
  const response = await fetch(`${url}/rest/v1/customer_reviews?select=*`, {
    method: "POST",
    headers: { ...publicHeaders(), "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ name: input.name.trim(), rating: input.rating, comment: input.comment.trim(), image_url: photoUrl }),
  });
  if (!response.ok) throw new Error(await readError(response));
  const rows = await response.json() as CustomerReview[];
  return rows[0];
}

export async function signInFlorist(email: string, password: string): Promise<string> {
  const { url, key } = requireConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(await readError(response));
  const session = await response.json() as { access_token: string; user?: { app_metadata?: { role?: string } } };
  if (session.user?.app_metadata?.role !== "floristeria") throw new Error("Esta cuenta no tiene permisos para responder reseñas.");
  return session.access_token;
}

export async function replyToCustomerReview(id: number, reply: string, token: string): Promise<void> {
  const { url } = requireConfig();
  const response = await fetch(`${url}/rest/v1/customer_reviews?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...publicHeaders(token), "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ florist_reply: reply.trim() }),
  });
  if (!response.ok) throw new Error(await readError(response));
}

-- Ejecutar en Supabase SQL Editor despues de experiencias.sql.
-- Guarda un solo me gusta por reseña y navegador.
create table if not exists public.customer_review_likes (
  review_id bigint not null references public.customer_reviews(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (review_id, visitor_id)
);

alter table public.customer_review_likes enable row level security;
revoke all on table public.customer_review_likes from public, anon, authenticated;
grant select, insert on table public.customer_review_likes to anon, authenticated;

drop policy if exists "Public can read customer review likes" on public.customer_review_likes;
create policy "Public can read customer review likes"
  on public.customer_review_likes for select to anon, authenticated
  using (true);

drop policy if exists "Visitors can like customer reviews" on public.customer_review_likes;
create policy "Visitors can like customer reviews"
  on public.customer_review_likes for insert to anon, authenticated
  with check (visitor_id is not null);

-- Run this once in the Supabase SQL Editor to enable admin review actions.
-- Both permissions are restricted to JWTs with app_metadata.role = floristeria.

grant delete on public.customer_reviews to authenticated;

drop policy if exists "Florist can delete customer reviews" on public.customer_reviews;
create policy "Florist can delete customer reviews"
  on public.customer_reviews for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'floristeria');

drop policy if exists "Florist can delete customer bouquet photos" on storage.objects;
create policy "Florist can delete customer bouquet photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'ramilletes-clientes'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'floristeria'
  );

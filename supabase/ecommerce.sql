-- Esquema inicial del punto de venta en linea de Isabella Flores.
-- Ejecutar una vez desde Supabase SQL Editor; este esquema no depende de las reseñas.
-- Todas las tablas tienen RLS. El checkout y las operaciones de pago se
-- deben procesar en un backend confiable (Edge Function), nunca con service_role
-- ni secretos del proveedor de pagos en el navegador.

begin;

grant usage on schema public to anon, authenticated;

-- Perfil basico creado junto con cada usuario de Supabase Auth. La metadata
-- solo se usa para mostrar el nombre; los roles viven en app_metadata.
create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  phone text check (phone is null or char_length(phone) <= 30),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.customer_profiles (user_id, display_name)
  values (
    new.id,
    nullif(btrim(left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 80)), '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_customer_profile() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_customer_profile on auth.users;
create trigger on_auth_user_created_customer_profile
  after insert on auth.users
  for each row execute function public.handle_new_customer_profile();

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 40),
  recipient_name text not null check (char_length(recipient_name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 30),
  address_line_1 text not null check (char_length(address_line_1) between 3 and 180),
  address_line_2 text check (address_line_2 is null or char_length(address_line_2) <= 180),
  neighborhood text check (neighborhood is null or char_length(neighborhood) <= 100),
  city text not null check (char_length(city) between 2 and 100),
  state text not null check (char_length(state) between 2 and 100),
  postal_code text not null check (char_length(postal_code) between 3 and 15),
  country_code char(2) not null default 'MX',
  delivery_instructions text check (delivery_instructions is null or char_length(delivery_instructions) <= 500),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists customer_addresses_user_idx on public.customer_addresses(user_id);
create unique index if not exists customer_addresses_one_default_idx
  on public.customer_addresses(user_id) where is_default;

-- Catalogo. Los precios son importes decimales; las existencias se guardan
-- por separado y no se exponen en el catalogo publico.
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text check (description is null or char_length(description) <= 1000),
  image_path text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.product_categories(id) on delete set null,
  sku text unique check (sku is null or char_length(sku) <= 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 160),
  description text check (description is null or char_length(description) <= 5000),
  base_price numeric(12,2) not null check (base_price >= 0),
  currency char(3) not null default 'MXN' check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'draft' check (status in ('draft','active','archived')),
  is_featured boolean not null default false,
  requires_delivery boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_status_idx on public.products(category_id, status);
create index if not exists products_created_idx on public.products(created_at desc);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique check (sku is null or char_length(sku) <= 80),
  name text not null check (char_length(name) between 1 and 120),
  price_override numeric(12,2) check (price_override is null or price_override >= 0),
  option_values jsonb not null default '{}'::jsonb check (jsonb_typeof(option_values) = 'object'),
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, product_id)
);
create index if not exists product_variants_product_idx on public.product_variants(product_id, is_active);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null check (char_length(storage_path) between 1 and 500),
  alt_text text check (alt_text is null or char_length(alt_text) <= 180),
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, storage_path)
);
create index if not exists product_images_product_idx on public.product_images(product_id, display_order);
create unique index if not exists product_images_one_primary_idx
  on public.product_images(product_id) where is_primary;

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  product_variant_id uuid,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0 and quantity_reserved <= quantity_on_hand),
  reorder_level integer not null default 0 check (reorder_level >= 0),
  updated_at timestamptz not null default now(),
  foreign key (product_variant_id, product_id)
    references public.product_variants(id, product_id) on delete cascade
);
create unique index if not exists inventory_items_product_idx
  on public.inventory_items(product_id) where product_variant_id is null;
create unique index if not exists inventory_items_variant_idx
  on public.inventory_items(product_variant_id) where product_variant_id is not null;

-- Carritos y favoritos. Solo se admiten carritos de cuentas autenticadas;
-- los carritos de invitado se agregaran cuando haya un checkout seguro.
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  currency char(3) not null default 'MXN' check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  product_variant_id uuid,
  quantity integer not null default 1 check (quantity between 1 and 99),
  gift_message text check (gift_message is null or char_length(gift_message) <= 500),
  created_at timestamptz not null default now(),
  foreign key (product_variant_id, product_id)
    references public.product_variants(id, product_id) on delete cascade
);
create index if not exists cart_items_cart_idx on public.cart_items(cart_id);
create unique index if not exists cart_items_product_without_variant_idx
  on public.cart_items(cart_id, product_id) where product_variant_id is null;
create unique index if not exists cart_items_variant_idx
  on public.cart_items(cart_id, product_variant_id) where product_variant_id is not null;

create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- Pedidos. El cliente puede leer los suyos; solo un backend confiable debe
-- crear pedidos, calcular totales y cambiar estados al confirmar el pago.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique check (char_length(order_number) between 6 and 40),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  customer_email text not null check (char_length(customer_email) <= 254),
  customer_phone text check (customer_phone is null or char_length(customer_phone) <= 30),
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment','paid','preparing','ready','shipped','delivered','cancelled','refunded')),
  currency char(3) not null default 'MXN' check (currency ~ '^[A-Z]{3}$'),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount_total numeric(12,2) not null default 0 check (discount_total >= 0 and discount_total <= subtotal),
  delivery_total numeric(12,2) not null default 0 check (delivery_total >= 0),
  tax_total numeric(12,2) not null default 0 check (tax_total >= 0),
  total numeric(12,2) not null check (total >= 0 and total = subtotal - discount_total + delivery_total + tax_total),
  shipping_address jsonb check (shipping_address is null or jsonb_typeof(shipping_address) = 'object'),
  billing_address jsonb check (billing_address is null or jsonb_typeof(billing_address) = 'object'),
  customer_note text check (customer_note is null or char_length(customer_note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid,
  product_variant_id uuid,
  product_name text not null check (char_length(product_name) between 1 and 160),
  variant_name text check (variant_name is null or char_length(variant_name) <= 120),
  sku_snapshot text check (sku_snapshot is null or char_length(sku_snapshot) <= 80),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 99),
  line_total numeric(12,2) not null check (line_total = round(unit_price * quantity, 2)),
  customization jsonb not null default '{}'::jsonb check (jsonb_typeof(customization) = 'object'),
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status text,
  new_status text not null check (new_status in ('awaiting_payment','paid','preparing','ready','shipped','delivered','cancelled','refunded')),
  note text check (note is null or char_length(note) <= 1000),
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists order_status_history_order_idx on public.order_status_history(order_id, created_at);

-- Nunca guardar numeros completos de tarjeta, CVV, PIN o datos de banda.
-- provider_reference es solo un identificador/token del proveedor de pagos.
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null check (char_length(provider) between 2 and 60),
  provider_reference text check (provider_reference is null or char_length(provider_reference) <= 250),
  status text not null default 'pending' check (status in ('pending','authorized','paid','failed','cancelled','refunded','partially_refunded')),
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null default 'MXN' check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payment_transactions_order_idx on public.payment_transactions(order_id, created_at desc);

create table if not exists public.order_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','preparing','shipped','delivered','failed','returned')),
  carrier text check (carrier is null or char_length(carrier) <= 100),
  tracking_number text check (tracking_number is null or char_length(tracking_number) <= 160),
  tracking_url text check (tracking_url is null or char_length(tracking_url) <= 1000),
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists order_shipments_order_idx on public.order_shipments(order_id);

-- Configuracion para proveedores de pago y zonas de entrega. Los secretos del
-- proveedor deben permanecer en Edge Function Secrets, nunca en estas tablas.
create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9_-]{2,50}$'),
  provider text not null check (char_length(provider) between 2 and 60),
  display_name text not null check (char_length(display_name) between 2 and 100),
  public_settings jsonb not null default '{}'::jsonb check (jsonb_typeof(public_settings) = 'object'),
  is_enabled boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9_-]{2,50}$'),
  name text not null check (char_length(name) between 2 and 100),
  city text not null check (char_length(city) between 2 and 100),
  state text not null check (char_length(state) between 2 and 100),
  postal_code_prefixes text[] not null default '{}',
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  estimated_hours integer check (estimated_hours is null or estimated_hours between 1 and 720),
  is_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code) and char_length(code) between 3 and 50),
  name text not null check (char_length(name) between 2 and 120),
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0 and (discount_type <> 'percentage' or discount_value <= 100)),
  minimum_subtotal numeric(12,2) not null default 0 check (minimum_subtotal >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  per_customer_limit integer check (per_customer_limit is null or per_customer_limit > 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  check (starts_at is null or ends_at is null or ends_at > starts_at)
);

create table if not exists public.promotion_redemptions (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references public.promotions(id) on delete restrict,
  order_id uuid not null references public.orders(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  discount_amount numeric(12,2) not null check (discount_amount >= 0),
  redeemed_at timestamptz not null default now(),
  unique (promotion_id, order_id)
);
create index if not exists promotion_redemptions_user_idx on public.promotion_redemptions(user_id, redeemed_at desc);

-- Solicitudes personalizadas/cotizaciones asociadas a una cuenta.
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_name text not null check (char_length(contact_name) between 2 and 120),
  contact_email text not null check (char_length(contact_email) <= 254),
  contact_phone text not null check (char_length(contact_phone) between 7 and 30),
  occasion text check (occasion is null or char_length(occasion) <= 120),
  requested_delivery_date date,
  target_budget numeric(12,2) check (target_budget is null or target_budget >= 0),
  details text not null check (char_length(details) between 10 and 3000),
  status text not null default 'new' check (status in ('new','reviewing','quoted','accepted','rejected','completed','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists quote_requests_user_created_idx on public.quote_requests(user_id, created_at desc);

create table if not exists public.quote_request_items (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null check (char_length(description) between 2 and 500),
  quantity integer not null default 1 check (quantity between 1 and 99),
  created_at timestamptz not null default now()
);
create index if not exists quote_request_items_parent_idx on public.quote_request_items(quote_request_id);

-- RLS se activa en absolutamente todas las tablas del esquema nuevo.
alter table public.customer_profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.order_shipments enable row level security;
alter table public.payment_methods enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.promotions enable row level security;
alter table public.promotion_redemptions enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quote_request_items enable row level security;

-- Permisos explicitos: solo el catalogo activo es publico; todas las escrituras
-- de clientes quedan limitadas a sus propios datos mediante RLS.
revoke all on table public.customer_profiles, public.customer_addresses,
  public.product_categories, public.products, public.product_variants, public.product_images,
  public.inventory_items, public.carts, public.cart_items, public.wishlist_items,
  public.orders, public.order_items, public.order_status_history, public.payment_transactions,
  public.order_shipments, public.payment_methods, public.delivery_zones, public.promotions,
  public.promotion_redemptions, public.quote_requests, public.quote_request_items
from public, anon, authenticated;

grant select on public.customer_profiles to authenticated;
grant update (display_name, phone) on public.customer_profiles to authenticated;
grant select, insert, update, delete on public.customer_addresses to authenticated;

grant select on public.product_categories, public.products, public.product_variants, public.product_images to anon;
grant select, insert, update, delete on public.product_categories, public.products, public.product_variants, public.product_images to authenticated;
grant select, insert, update, delete on public.inventory_items to authenticated;

grant select, insert, update, delete on public.carts, public.cart_items, public.wishlist_items to authenticated;
grant select on public.orders, public.order_items, public.order_status_history to authenticated;
grant select (id, order_id, status, amount, currency, created_at, updated_at) on public.payment_transactions to authenticated;
grant select (id, order_id, status, carrier, tracking_number, tracking_url, shipped_at, delivered_at, created_at)
  on public.order_shipments to authenticated;

grant select, insert, update, delete on public.payment_methods, public.delivery_zones, public.promotions to authenticated;
grant select on public.promotion_redemptions to authenticated;
grant select, insert on public.quote_requests, public.quote_request_items to authenticated;

-- Perfiles y domicilios.
drop policy if exists "Customers read own profile" on public.customer_profiles;
create policy "Customers read own profile" on public.customer_profiles for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Customers update own profile" on public.customer_profiles;
create policy "Customers update own profile" on public.customer_profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Florist manages profiles" on public.customer_profiles;
create policy "Florist manages profiles" on public.customer_profiles for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers manage own addresses" on public.customer_addresses;
create policy "Customers manage own addresses" on public.customer_addresses for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Florist manages addresses" on public.customer_addresses;
create policy "Florist manages addresses" on public.customer_addresses for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

-- Catalogo publico y escritura reservada a personal con rol confiable.
drop policy if exists "Anyone reads active categories" on public.product_categories;
create policy "Anyone reads active categories" on public.product_categories for select to anon, authenticated using (is_active);
drop policy if exists "Florist manages categories" on public.product_categories;
create policy "Florist manages categories" on public.product_categories for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Anyone reads active products" on public.products;
create policy "Anyone reads active products" on public.products for select to anon, authenticated using (status = 'active');
drop policy if exists "Florist manages products" on public.products;
create policy "Florist manages products" on public.products for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Anyone reads active product variants" on public.product_variants;
create policy "Anyone reads active product variants" on public.product_variants for select to anon, authenticated
  using (is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
drop policy if exists "Florist manages product variants" on public.product_variants;
create policy "Florist manages product variants" on public.product_variants for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Anyone reads active product images" on public.product_images;
create policy "Anyone reads active product images" on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
drop policy if exists "Florist manages product images" on public.product_images;
create policy "Florist manages product images" on public.product_images for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Florist manages inventory" on public.inventory_items;
create policy "Florist manages inventory" on public.inventory_items for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

-- Carrito y favoritos: RLS verifica propiedad tanto en filas como en relaciones.
drop policy if exists "Customers manage own carts" on public.carts;
create policy "Customers manage own carts" on public.carts for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Florist reads carts" on public.carts;
create policy "Florist reads carts" on public.carts for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers manage own cart items" on public.cart_items;
create policy "Customers manage own cart items" on public.cart_items for all to authenticated
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())));
drop policy if exists "Florist reads cart items" on public.cart_items;
create policy "Florist reads cart items" on public.cart_items for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers manage own wishlist" on public.wishlist_items;
create policy "Customers manage own wishlist" on public.wishlist_items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Florist reads wishlists" on public.wishlist_items;
create policy "Florist reads wishlists" on public.wishlist_items for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

-- Pedidos, pagos y entregas son de solo lectura desde el navegador del cliente.
drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders" on public.orders for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Florist reads orders" on public.orders;
create policy "Florist reads orders" on public.orders for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers read own order items" on public.order_items;
create policy "Customers read own order items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
drop policy if exists "Florist reads order items" on public.order_items;
create policy "Florist reads order items" on public.order_items for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers read own order history" on public.order_status_history;
create policy "Customers read own order history" on public.order_status_history for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
drop policy if exists "Florist reads order history" on public.order_status_history;
create policy "Florist reads order history" on public.order_status_history for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers read safe payment details" on public.payment_transactions;
create policy "Customers read safe payment details" on public.payment_transactions for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
drop policy if exists "Florist reads safe payment details" on public.payment_transactions;
create policy "Florist reads safe payment details" on public.payment_transactions for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers read own shipments" on public.order_shipments;
create policy "Customers read own shipments" on public.order_shipments for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
drop policy if exists "Florist reads shipments" on public.order_shipments;
create policy "Florist reads shipments" on public.order_shipments for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

-- Configuracion y promociones solo se consultan desde backend o por personal.
drop policy if exists "Florist manages payment methods" on public.payment_methods;
create policy "Florist manages payment methods" on public.payment_methods for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));
drop policy if exists "Florist manages delivery zones" on public.delivery_zones;
create policy "Florist manages delivery zones" on public.delivery_zones for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));
drop policy if exists "Florist manages promotions" on public.promotions;
create policy "Florist manages promotions" on public.promotions for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers read own promotion redemptions" on public.promotion_redemptions;
create policy "Customers read own promotion redemptions" on public.promotion_redemptions for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "Florist reads promotion redemptions" on public.promotion_redemptions;
create policy "Florist reads promotion redemptions" on public.promotion_redemptions for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

-- Los clientes crean cotizaciones nuevas y consultan solo sus solicitudes.
-- El estado de atencion solo puede cambiarse con privilegios de backend.
drop policy if exists "Customers read own quote requests" on public.quote_requests;
create policy "Customers read own quote requests" on public.quote_requests for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Customers create own quote requests" on public.quote_requests;
create policy "Customers create own quote requests" on public.quote_requests for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'new');
drop policy if exists "Florist manages quote requests" on public.quote_requests;
create policy "Florist manages quote requests" on public.quote_requests for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

drop policy if exists "Customers read own quote items" on public.quote_request_items;
create policy "Customers read own quote items" on public.quote_request_items for select to authenticated
  using (exists (select 1 from public.quote_requests q where q.id = quote_request_id and q.user_id = (select auth.uid())));
drop policy if exists "Customers add items to own quote" on public.quote_request_items;
create policy "Customers add items to own quote" on public.quote_request_items for insert to authenticated
  with check (exists (select 1 from public.quote_requests q where q.id = quote_request_id and q.user_id = (select auth.uid())));
drop policy if exists "Florist manages quote items" on public.quote_request_items;
create policy "Florist manages quote items" on public.quote_request_items for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

-- Almacenamiento publico de imagenes del catalogo; solo personal administra.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalogo-productos', 'catalogo-productos', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads ecommerce product images" on storage.objects;
create policy "Public reads ecommerce product images" on storage.objects for select to anon, authenticated
  using (bucket_id = 'catalogo-productos');
drop policy if exists "Florist uploads ecommerce product images" on storage.objects;
create policy "Florist uploads ecommerce product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'catalogo-productos' and (auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));
drop policy if exists "Florist updates ecommerce product images" on storage.objects;
create policy "Florist updates ecommerce product images" on storage.objects for update to authenticated
  using (bucket_id = 'catalogo-productos' and (auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'))
  with check (bucket_id = 'catalogo-productos' and (auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));
drop policy if exists "Florist deletes ecommerce product images" on storage.objects;
create policy "Florist deletes ecommerce product images" on storage.objects for delete to authenticated
  using (bucket_id = 'catalogo-productos' and (auth.jwt() -> 'app_metadata' ->> 'role') in ('floristeria','admin'));

commit;

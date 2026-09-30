# Supabase: cuentas, experiencias y comercio

## Variables locales

Copia `.env.example` a `.env.local` y configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con los valores del proyecto. Una clave publishable (o la antigua clave `anon`) puede estar en el navegador si las tablas están protegidas con RLS. Nunca uses una clave `service_role` o `secret` en una variable `VITE_*`; `.env.local` está excluido de Git.

## Contraseñas y acceso

La app usa Supabase Auth para registro, inicio de sesión, recuperación y actualización de contraseña. Supabase almacena contraseñas con hash bcrypt; no se guardan contraseñas ni hashes en las tablas de la aplicación. La web pide 12 caracteres al registrarse y al restablecer la contraseña. Configura también el mínimo de 12 caracteres del lado del servidor en **Authentication → Settings → Password** y activa la detección de contraseñas filtradas si está disponible. Al endurecer el requisito, usuarios existentes con contraseñas más cortas podrían necesitar restablecerlas.

El cliente usa PKCE y mantiene la sesión con `@supabase/supabase-js`. Para Google, habilita **Authentication → Sign In / Providers → Google**, añade credenciales OAuth de Google Cloud y configura los orígenes y URI de redirección en Supabase. Las claves privadas de Google pertenecen al panel de Supabase, no al repositorio.

La identidad del personal se reconoce por `app_metadata.role`, que los usuarios no pueden cambiar desde su perfil. Para dar acceso administrativo a una cuenta, reemplaza el correo y ejecuta desde SQL Editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"floristeria"}'::jsonb
where email = 'correo-de-la-floristeria@example.com';
```

## Experiencias públicas

Ejecuta `supabase/experiencias.sql` desde Supabase SQL Editor. Crea la tabla pública `customer_reviews`, políticas RLS y el bucket `ramilletes-clientes` para fotos JPG, PNG y WEBP de hasta 5 MB. Lectura y aportes son públicos; solo cuentas con el rol de floristería pueden responder.

## Tablas del comercio

Si todavía no aplicaste `supabase/experiencias.sql`, ejecútalo una sola vez primero. Después ejecuta `supabase/ecommerce.sql` desde SQL Editor. Si las experiencias ya están funcionando, ejecuta solo el esquema de comercio; el archivo de comercio no depende de la tabla de reseñas. El esquema crea:

- Perfiles y direcciones de clientes.
- Categorías, productos, variantes, imágenes e inventario.
- Carritos y favoritos.
- Pedidos, partidas, historial de estado, pagos y envíos.
- Métodos de pago, zonas de entrega, promociones y canjes.
- Solicitudes de cotización y partidas personalizadas.

RLS se activa en cada tabla. Los permisos de Data API se otorgan explícitamente; el catálogo activo es público y los datos de cada cliente quedan limitados por su sesión. Inventario, configuración de pagos, promociones y operaciones de compra no se exponen a visitantes anónimos. Los clientes no pueden crear pedidos ni marcar pagos como completados desde el navegador.

El archivo prepara el esquema, pero no aplica cambios al proyecto Supabase por sí solo. Debe ejecutarse en el SQL Editor del proyecto. Antes de aceptar compras, implementa el checkout en un backend confiable (por ejemplo, Edge Functions) y configura allí los secretos del proveedor. `payment_transactions` admite referencias del proveedor, nunca PAN, CVV, PIN ni datos de banda de tarjetas.

Las imágenes de catálogo se almacenan en el bucket público `catalogo-productos`; solo personal autorizado con `app_metadata.role` `floristeria` o `admin` puede subirlas, cambiarlas o borrarlas.

## Desarrollo local

```bash
npm install
npm run dev
```

El proyecto no incluye una clave de base de datos ni un backend de checkout. La clave publishable del navegador no sustituye a `service_role`; una futura función de servidor debe guardar sus secretos en Supabase Edge Function Secrets.

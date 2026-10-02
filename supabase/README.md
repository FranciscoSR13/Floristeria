# Conectar Isabella Floristería a Supabase y desplegar en Vercel

Esta guía configura la función activa de experiencias de clientes y publica el sitio. El proyecto también contiene un esquema de comercio preparado para una futura tienda; no hace falta instalarlo para habilitar las reseñas. El inicio de sesión de clientes y las ventas en línea todavía no están habilitados en el sitio.

## 1. Crear o abrir el proyecto de Supabase

1. Inicia sesión en [Supabase](https://supabase.com/dashboard) y crea un proyecto nuevo, o abre el proyecto que usarás para Isabella Floristería.
2. Conserva de forma privada la contraseña de la base de datos que solicite Supabase. La aplicación web no la necesita.
3. En el panel del proyecto, abre **SQL Editor** y crea una consulta nueva.
4. Desde este repositorio, abre `supabase/experiencias.sql`, copia todo el contenido en la consulta y pulsa **Run** una sola vez. Este archivo crea `public.customer_reviews`, sus políticas RLS y el bucket público `ramilletes-clientes` (JPG, PNG y WEBP, hasta 5 MB).
5. En **Table Editor**, confirma que aparece `customer_reviews`; en **Storage**, confirma que aparece `ramilletes-clientes`.

El SQL otorga los permisos necesarios para que visitantes puedan leer y publicar experiencias y fotos. Las respuestas de la floristería requieren una cuenta autenticada con el rol `floristeria`. No ejecutes `ecommerce.sql` para conectar esta pantalla: ese esquema se reserva para cuando se implemente la tienda.

## 2. Configurar la conexión local

En el panel de Supabase abre **Project Settings → API Keys** (o el diálogo **Connect**) y copia:

- La **Project URL**.
- La **publishable key**, que normalmente comienza con `sb_publishable_`.

En Windows PowerShell, desde la carpeta raíz del proyecto, crea tu archivo local:

```powershell
Copy-Item .env.example .env.local
```

En macOS o Linux puedes usar `cp .env.example .env.local`. Edita `.env.local` y reemplaza los valores de ejemplo:

```dotenv
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

No agregues comillas ni espacios alrededor del signo `=`. `.env.local` está excluido de Git. La clave publishable se usa en el navegador y depende de las políticas RLS del SQL; nunca pongas una clave `service_role`, `secret`, contraseña de base de datos o secreto de Google en una variable `VITE_*`.

Instala dependencias y arranca el servidor:

```bash
npm install
npm run dev
```

Abre la dirección local que muestre Vite y visita `/experiencias`. La pantalla debe cargar las opiniones, mostrar el porcentaje de satisfacción y permitir publicar una experiencia con nombre, calificación, comentario y foto.

## 3. Comprobar la conexión y resolver errores comunes

- Si aparece el aviso de que falta conectar la base de datos, confirma que `.env.local` está en la raíz, que los nombres de variables coinciden exactamente y que reiniciaste `npm run dev` después de editarlo.
- Si las opiniones no cargan o aparece un error de permisos, confirma que ejecutaste `experiencias.sql` en el proyecto correcto y que las tablas tienen RLS y las políticas del archivo. En **Project Settings → API** revisa también que el esquema `public` esté expuesto a la Data API.
- Si se puede leer pero no publicar, verifica las políticas de inserción de `customer_reviews` y de carga de objetos en el bucket `ramilletes-clientes`.
- La carga de fotos permite solo JPG, PNG o WEBP de hasta 5 MB. La URL pública de la foto se guarda en `customer_reviews`.
- Revisa **Logs → API** y **Logs → Storage** en Supabase para ver detalles de solicitudes rechazadas.

## 4. Preparar el despliegue en Vercel

El archivo [`vercel.json`](../vercel.json) ya incluye la regla SPA de Vercel. Como la aplicación usa React Router, esta regla permite abrir directamente rutas como `/experiencias`, `/nosotros` y `/contacto` sin recibir un 404.

Antes de desplegar, sube el proyecto a un repositorio Git (por ejemplo, GitHub). En Vercel:

1. Selecciona **Add New → Project** e importa el repositorio.
2. Deja **Root Directory** en la raíz del repositorio. Vercel detecta Vite; comprueba estos ajustes si no aparecen automáticamente:
   - Framework Preset: **Vite**.
   - Install Command: `npm install`.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. En **Environment Variables**, agrega estas dos variables con los valores del mismo proyecto Supabase:

   | Name | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | Project URL, por ejemplo `https://tu-proyecto.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | La clave `sb_publishable_...` |

   Actívalas para **Production**, **Preview** y **Development** según los entornos que vayas a usar. No agregues credenciales secretas del servidor como variables `VITE_*`.

4. Pulsa **Deploy**. Vercel instalará las dependencias, ejecutará el build y publicará el contenido de `dist`.
5. Abre la URL publicada y comprueba `/`, `/experiencias` y una ruta interna como `/nosotros`. Publica una experiencia de prueba y confirma en Supabase que aparece en `customer_reviews` y en el bucket.

Vite incorpora las variables `VITE_*` al compilar. Si cambias una variable en Vercel, inicia un nuevo despliegue para que la versión publicada use el valor actualizado. Cada push al repositorio puede crear despliegues de vista previa; los cambios en la rama de producción generan la versión productiva.

## 5. Tienda futura y autenticación

Cuando se implemente el catálogo y la compra en línea, ejecuta `supabase/ecommerce.sql` desde **SQL Editor**. Si `experiencias.sql` aún no está instalado, ejecuta ese primero. El esquema de comercio prepara perfiles y domicilios, catálogo, carritos, pedidos, pagos, entregas, promociones y cotizaciones; no implementa por sí solo las pantallas ni un checkout seguro. Las operaciones de compra y los secretos de pago deben ejecutarse en un backend confiable, como Supabase Edge Functions.

La autenticación de clientes y el proveedor Google también quedan para esa etapa. Las credenciales privadas de Google se configuran en Supabase, nunca en el repositorio. El rol del personal se asigna en `app_metadata.role`, no en la metadata editable por el usuario. Para habilitar respuestas de la floristería, asigna el rol desde **SQL Editor** a la cuenta correspondiente:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"floristeria"}'::jsonb
where email = 'correo-de-la-floristeria@example.com';
```

Para permitir Google más adelante, configura el proveedor en **Authentication → Sign In / Providers → Google** y registra los orígenes y URL de redirección que indique Supabase.

## Referencias oficiales

- [Claves de API de Supabase](https://supabase.com/docs/guides/getting-started/api-keys)
- [Lista de seguridad para producción de Supabase](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Despliegue de Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Rewrites y rutas de Vercel](https://vercel.com/docs/routing/rewrites)
- [Guía de Vite](https://vite.dev/guide/)

# Isabella Floristería

Sitio web de Isabella Floristería, en Atlixco, Puebla. Incluye presentación del negocio, portafolio, contacto y experiencias públicas de clientes. La tienda en línea está preparada para una próxima etapa.

## Inicio rápido

Necesitas Node.js compatible con Vite 8 (20.19+ o 22.12+) y npm.

1. Crea un proyecto en Supabase y ejecuta `supabase/experiencias.sql` desde su **SQL Editor**.
2. Copia `.env.example` como `.env.local` y agrega la Project URL y la clave publishable de Supabase:

   ```dotenv
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

3. Instala dependencias e inicia el sitio:

   ```bash
   npm install
   npm run dev
   ```

Abre `/experiencias` en el servidor local para revisar las opiniones y el formulario de aportes.

## Despliegue

El proyecto está configurado para Vercel. Importa el repositorio en Vercel, deja el directorio raíz como **Root Directory** y configura `npm run build` como comando de compilación y `dist` como directorio de salida. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en las variables de entorno de Vercel y despliega. `vercel.json` permite que las rutas de React Router funcionen al abrirlas directamente.

La clave publishable es para el navegador y las tablas están protegidas con RLS. No publiques `.env.local` ni uses una clave `service_role` o `secret` en variables `VITE_*`.

Consulta [la guía completa de conexión a Supabase y despliegue en Vercel](supabase/README.md).

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor local de desarrollo. |
| `npm run build` | Comprueba TypeScript y genera `dist/`. |
| `npm run preview` | Previsualiza la compilación de producción. |
| `npm run lint` | Revisa el código con Oxlint. |

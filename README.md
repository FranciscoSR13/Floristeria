# Isabella Floristeria 

Sitio web de la floristería **Isabella Floristeria**, en Atlixco, Puebla. Incluye presentación del negocio, portafolio, experiencias de clientes, contacto y acceso de clientes. El catálogo y la compra en línea están preparados como módulos de próxima apertura.

## Preparar el proyecto

1. Instala Node.js compatible con Vite 8 y npm.
2. Copia `.env.example` a `.env.local` y agrega la URL y la clave **publishable** del proyecto Supabase.
3. Si aún no conectaste las experiencias, ejecuta `supabase/experiencias.sql` una sola vez. Después ejecuta `supabase/ecommerce.sql` desde Supabase SQL Editor. Si las experiencias ya funcionan, ejecuta solo el esquema de comercio.
4. Inicia la web:

```bash
npm install
npm run dev
```

## Seguridad y cuentas

- El acceso usa Supabase Auth con flujo PKCE. Supabase recibe la contraseña por HTTPS y la almacena con hash bcrypt; la aplicación no guarda ni calcula hashes de contraseñas.
- El alta y la recuperación piden al menos 12 caracteres en la interfaz. Repite ese mínimo en **Authentication → Settings → Password** para que también se aplique en el servidor, y activa la comprobación de contraseñas filtradas si está disponible en el plan. Las cuentas existentes con contraseñas más cortas podrían necesitar restablecerlas al endurecer el requisito.
- Las sesiones se mantienen con el cliente oficial de Supabase. El proveedor Google requiere credenciales OAuth propias configuradas en el panel de Supabase.
- Las tablas del comercio tienen RLS y permisos explícitos. Cada cliente solo puede consultar o modificar sus propios datos; el catálogo activo es público.
- El checkout, los precios finales, el inventario, el estado de los pedidos y las llamadas de pago deben ejecutarse en un backend confiable, como una Supabase Edge Function. No se guardan números completos de tarjeta, CVV ni claves secretas del proveedor en la web.
- Nunca pongas una clave `service_role`, `secret` de Supabase ni credenciales privadas en variables `VITE_*`. `.env.local` está excluido de Git.

## Esquema preparado para comercio

`supabase/ecommerce.sql` crea perfiles y domicilios, categorías, productos, variantes, imágenes, inventario, carritos, favoritos, pedidos y sus partidas e historial, pagos, entregas, métodos de pago, zonas de entrega, promociones, canjes y solicitudes de cotización. Las operaciones críticas de pago y compra quedan reservadas al backend; el archivo prepara la base de datos, no activa todavía el checkout.

Las rutas de tienda, producto, carrito, pago, entregas, pedidos, inventario, promociones y cotizaciones muestran el estado de “Próximamente” hasta que se construyan sus pantallas funcionales.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Comprueba TypeScript y genera `dist/`. |
| `npm run preview` | Previsualiza la compilación de producción. |

Consulta [supabase/README.md](supabase/README.md) para la configuración de Auth, Google, experiencias y comercio.

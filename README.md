# Isabella Flores

Sitio web de **Isabella Flores**, una floristería ubicada en Atlixco, Puebla. El proyecto presenta la marca y sus arreglos florales, muestra trabajos y experiencias, e invita a los visitantes a solicitar diseños personalizados o cotizaciones por WhatsApp.

## Funcionalidades

- Página de inicio con categorías, arreglos destacados, promociones y accesos para cotizar.
- Secciones de trabajos, historia de la floristería, experiencias de clientes y contacto.
- Navegación entre páginas con React Router y menú adaptable a dispositivos móviles.
- Enlaces de cotización que abren WhatsApp con un mensaje inicial.
- Imágenes de marca almacenadas en `public/images` y fotografías de Unsplash para algunos elementos visuales.

El sitio es actualmente una **interfaz de presentación**. Aunque el repositorio incluye algunos componentes y páginas preliminares para tienda, carrito, cuenta y cotización, esas vistas no están conectadas al recorrido principal. No hay un flujo de compra, inicio de sesión ni envío funcional de formularios implementado todavía. Los datos de contacto visibles en la página de contacto son textos de ejemplo y deben actualizarse antes de publicar el sitio.

## Tecnologías

- React 19 y TypeScript
- Vite 8
- React Router 7
- Lucide React para iconos
- ESLint para análisis estático

## Requisitos

- Node.js compatible con Vite 8
- npm

## Instalación y desarrollo

Desde la carpeta del proyecto, instala las dependencias e inicia el servidor local:

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir en el navegador. Para generar una compilación de producción y previsualizarla:

```bash
npm run build
npm run preview
```

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Comprueba los tipos de TypeScript y genera la compilación en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |

## Estructura del proyecto

```text
public/
  images/          Logotipos, fotografías y recursos de marca
src/
  components/      Componentes reutilizables de interfaz
  layouts/         Estructura compartida de navegación y pie de página
  pages/           Vistas del sitio
  services/        Espacio reservado para servicios e integraciones
  types/           Tipos de TypeScript
  App.tsx          Rutas principales
```

## Páginas principales

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio y presentación de arreglos destacados. |
| `/trabajos` | Portafolio de diseños florales. |
| `/nosotros` | Historia y valores de la floristería. |
| `/experiencias` | Testimonios y experiencias de clientes. |
| `/contacto` | Información de contacto y formulario visual. |

Las rutas desconocidas redirigen actualmente a la página de inicio.

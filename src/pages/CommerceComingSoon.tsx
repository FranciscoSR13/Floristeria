import { ArrowRight, Check, ClipboardList, CreditCard, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const commerceModules = [
  { path: "/tienda", label: "Catálogo", description: "Colecciones, categorías, disponibilidad y búsqueda de arreglos.", icon: ShoppingBag },
  { path: "/producto/proximamente", label: "Productos", description: "Fotos, variantes, precios, dedicatorias y detalles de cada arreglo.", icon: PackageCheck },
  { path: "/carrito", label: "Carrito", description: "Revisión del pedido, cantidades, notas y resumen de compra.", icon: ShoppingBag },
  { path: "/pago", label: "Finalizar compra", description: "Datos de entrega, confirmación del pedido y comprobante.", icon: CreditCard },
  { path: "/metodos-de-pago", label: "Métodos de pago", description: "Opciones de pago seguras y confirmación de transacciones.", icon: CreditCard },
  { path: "/entregas", label: "Entregas", description: "Cobertura, fecha, horario y seguimiento de entrega.", icon: Truck },
  { path: "/pedidos", label: "Pedidos y seguimiento", description: "Estado de preparación, entrega y notificaciones del pedido.", icon: PackageCheck },
  { path: "/inventario", label: "Inventario", description: "Disponibilidad de flores, productos y materiales para cada temporada.", icon: ClipboardList },
  { path: "/promociones", label: "Promociones", description: "Ofertas, fechas especiales y códigos de descuento.", icon: Check },
  { path: "/cotizacion", label: "Pedidos personalizados", description: "Solicitudes especiales para regalos, eventos y celebraciones.", icon: Check },
];

function CommerceComingSoon() {
  const { pathname } = useLocation();
  const activeModule = pathname.startsWith("/producto/")
    ? commerceModules[1]
    : commerceModules.find((item) => item.path === pathname) ?? commerceModules[0];
  const ActiveIcon = activeModule.icon;

  return (
    <main className="commerce-soon-page">
      <section className="commerce-soon-hero">
        <div className="section-container commerce-soon-hero-inner">
          <span className="commerce-soon-pill"><span /> ESTAMOS PREPARANDO ALGO ESPECIAL</span>
          <div className="commerce-soon-icon"><ActiveIcon size={34} /></div>
          <p className="section-label">{activeModule.label.toUpperCase()}</p>
          <h1>Próximamente:<br /><em>catálogo y venta en línea</em></h1>
          <p className="commerce-soon-description">Estamos preparando una experiencia sencilla y segura para que elijas tus flores, personalices tu pedido y coordines la entrega.</p>
          <Link className="commerce-whatsapp-link" to="/contacto">Mientras tanto, contáctanos <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="commerce-modules-section">
        <div className="section-container">
          <div className="commerce-modules-heading"><span className="section-label">PUNTO DE VENTA EN LÍNEA</span><h2>Un espacio para cada parte de tu compra</h2><p>Estos módulos ya tienen su espacio listo. Los habilitaremos conforme esté disponible la tienda.</p></div>
          <div className="commerce-modules-grid">
            {commerceModules.map(({ path, label, description, icon: Icon }, index) => {
              const isCurrent = path === activeModule.path || (label === "Productos" && pathname.startsWith("/producto/"));
              return <Link className={isCurrent ? "commerce-module-card current" : "commerce-module-card"} to={path} key={label}><span className="commerce-module-number">0{index + 1}</span><span className="commerce-module-icon"><Icon size={21} /></span><h3>{label}</h3><p>{description}</p><span className="commerce-module-status">{isCurrent ? "Módulo seleccionado" : "Próximamente"}<ArrowRight size={15} /></span></Link>;
            })}
          </div>
          <div className="commerce-safe-note"><ShieldCheck size={20} /><p><strong>Compra con confianza</strong><span>Los métodos de pago y el manejo de datos se habilitarán cuando el proceso esté listo para operar de forma segura.</span></p></div>
        </div>
      </section>
    </main>
  );
}

export default CommerceComingSoon;

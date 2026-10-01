import { useLayoutEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Trabajos from "./pages/Trabajos";
import Nosotros from "./pages/Nosotros";
import Experiencias from "./pages/Experiencias";
import Contacto from "./pages/Contacto";
import CommerceComingSoon from "./pages/CommerceComingSoon";
import Login from "./pages/Login";
import Cuenta from "./pages/Cuenta";
import { AuthProvider } from "./contexts/AuthContext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/trabajos" element={<Trabajos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/experiencias" element={<Experiencias />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tienda" element={<CommerceComingSoon />} />
            <Route path="/producto/:id" element={<CommerceComingSoon />} />
            <Route path="/carrito" element={<CommerceComingSoon />} />
            <Route path="/pago" element={<CommerceComingSoon />} />
            <Route path="/metodos-de-pago" element={<CommerceComingSoon />} />
            <Route path="/entregas" element={<CommerceComingSoon />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/pedidos" element={<CommerceComingSoon />} />
            <Route path="/inventario" element={<CommerceComingSoon />} />
            <Route path="/promociones" element={<CommerceComingSoon />} />
            <Route path="/cotizacion" element={<Navigate to="/contacto#ayuda" replace />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

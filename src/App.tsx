import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Trabajos from "./pages/Trabajos";
import Nosotros from "./pages/Nosotros";
import Experiencias from "./pages/Experiencias";
import Contacto from "./pages/Contacto";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trabajos" element={<Trabajos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/experiencias" element={<Experiencias />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

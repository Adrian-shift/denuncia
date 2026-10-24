import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { DenunciaProvider } from "./context/DenunciaContext";
import Home from "./pages/Home";
import Ajuda from "./pages/Ajuda";
import Enviada from "./pages/Enviada";
import Historico from "./pages/Historico";
import AjustarLocal from "./pages/AjustarLocal";
import DetalheDenuncia from "./pages/DetalheDenuncia";

function Layout() {
  return (
    <main className="page">
      <section className="phone">
        <Outlet />
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DenunciaProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ajuda" element={<Ajuda />} />
            <Route path="/local" element={<AjustarLocal />} />
            <Route path="/enviada" element={<Enviada />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/denuncia/:protocolo" element={<DetalheDenuncia />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </DenunciaProvider>
    </BrowserRouter>
  );
}
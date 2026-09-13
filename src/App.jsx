import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RUTA_ADMIN_LOGIN, RUTA_ADMIN_PANEL } from "./config/rutas";
import RutaProtegida from "./components/RutaProtegida";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CancelarPedido from "./pages/CancelarPedido";
import GestionarPedido from "./pages/GestionarPedido";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Acceso de administrador: ruta secreta, sin ningún enlace
              visible en la web pública. Ver src/config/rutas.js */}
          <Route path={RUTA_ADMIN_LOGIN} element={<AdminLogin />} />
          <Route
            path={RUTA_ADMIN_PANEL}
            element={
              <RutaProtegida>
                <AdminDashboard />
              </RutaProtegida>
            }
          />
          <Route path="/cancelar" element={<CancelarPedido />} />
          <Route path="/gestionar" element={<GestionarPedido />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./components/RutaProtegida";
import HacerPedido from "./pages/HacerPedido";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CancelarPedido from "./pages/CancelarPedido";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HacerPedido />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RutaProtegida><AdminDashboard /></RutaProtegida>} />
          <Route path="/cancelar" element={<CancelarPedido />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
// src/components/RutaProtegida.jsx
//
// Envuelve cualquier página que solo debe verse si hay un administrador
// con sesión iniciada. Si no hay sesión, redirige al login.
// Importante: esto es solo una comodidad de navegación en el navegador —
// la protección REAL de los datos la hacen las reglas de seguridad de
// Firestore, no este componente.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p style={{ padding: "2rem" }}>Verificando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

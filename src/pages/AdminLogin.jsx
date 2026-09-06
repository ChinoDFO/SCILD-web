// src/pages/AdminLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesionAdmin } from "../services/auth";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navegar = useNavigate();

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await iniciarSesionAdmin(correo, password);
      navegar("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pagina-login">
      <form className="tarjeta-login" onSubmit={manejarEnvio}>
        <h1>Panel de administrador — SCILD</h1>

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}

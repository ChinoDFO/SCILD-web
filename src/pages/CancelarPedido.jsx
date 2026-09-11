// src/pages/CancelarPedido.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { cancelarPedido } from "../services/pedidos";
import { enviarCorreoPedidoCancelado } from "../services/notificaciones";
import "./CancelarPedido.css";

const DATOS_INICIALES = { nombre: "", correo: "", codigo: "" };

export default function CancelarPedido() {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [cancelado, setCancelado] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);

  function actualizarCampo(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const resultado = await cancelarPedido(datos);
      enviarCorreoPedidoCancelado({
        correo: datos.correo,
        nombre: datos.nombre,
        numeroPedido: resultado.numeroPedido,
      }).catch((err) =>
        console.error("No se pudo enviar el correo de cancelación:", err)
      );
      setNumeroPedido(resultado.numeroPedido);
      setCancelado(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo cancelar el pedido.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-cancelar-wrap">
      <header className="barra-superior">
        <Link to="/" className="marca">SCILD</Link>
        <nav className="barra-superior-nav">
          <Link to="/admin/login">Administrador</Link>
        </nav>
      </header>

      {cancelado ? (
        <main className="pagina-cancelar entrada">
          <div className="aviso aviso-ok">
            <h1>Tu pedido fue cancelado</h1>
            <p>
              El pedido #{numeroPedido} quedó cancelado y el stock de esa
              versión ya se repuso. Te llegará un correo confirmándolo. Revis
              tu bandeja de entrada (y la carpeta de spam) para asegurarte de
              que lo recibiste.
            </p>
          </div>
          <p><Link to="/">Volver al inicio</Link></p>
        </main>
      ) : (
        <main className="pagina-cancelar entrada">
          <h1>Cancelar un pedido</h1>
          <p className="instrucciones">
            Escribe el nombre y correo con los que hiciste el pedido, junto
            con el código de cancelación que te mostramos al hacerlo.
          </p>

          <form className="formulario-cancelar" onSubmit={manejarEnvio}>
            <label>
              Nombre completo (igual que en el pedido)
              <input
                type="text"
                value={datos.nombre}
                onChange={(e) => actualizarCampo("nombre", e.target.value)}
                required
              />
            </label>

            <label>
              Correo (igual que en el pedido)
              <input
                type="email"
                value={datos.correo}
                onChange={(e) => actualizarCampo("correo", e.target.value)}
                required
              />
            </label>

            <label>
              Código de cancelación
              <input
                type="text"
                value={datos.codigo}
                onChange={(e) => actualizarCampo("codigo", e.target.value)}
                required
              />
            </label>

            {error && <p className="mensaje-error">{error}</p>}

            <button type="submit" disabled={enviando}>
              {enviando ? "Cancelando..." : "Cancelar pedido"}
            </button>
          </form>

          <p className="enlace-volver">
            <Link to="/">Volver al inicio</Link>
          </p>
        </main>
      )}
    </div>
  );
}
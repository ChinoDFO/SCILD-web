// src/pages/GestionarPedido.jsx
//
// Página pública "Gestionar pedido": con el nombre, correo y código que se
// le dieron a la persona al hacer su pedido, puede consultar en qué va
// (pendiente, confirmado, entregado o cancelado) y, si todavía se puede,
// cancelarlo desde ahí mismo, sin tener que ir a otra pantalla.

import { useState } from "react";
import { Link } from "react-router-dom";
import { obtenerPedido, cancelarPedido } from "../services/pedidos";
import { enviarCorreoPedidoCancelado } from "../services/notificaciones";
import { formatearFecha } from "../utils/fechas";
import MenuGestion from "../components/MenuGestion";
import "./GestionarPedido.css";

const DATOS_INICIALES = { nombre: "", correo: "", codigo: "" };

const ETIQUETAS_ESTADO = {
  pendiente: "Pendiente de confirmación",
  confirmado: "Confirmado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default function GestionarPedido() {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [consultando, setConsultando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [error, setError] = useState("");
  const [pedido, setPedido] = useState(null);

  function actualizarCampo(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function manejarConsulta(evento) {
    evento.preventDefault();
    setError("");
    setConsultando(true);
    try {
      const resultado = await obtenerPedido(datos);
      setPedido(resultado);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo consultar el pedido.");
      setPedido(null);
    } finally {
      setConsultando(false);
    }
  }

  async function manejarCancelacion() {
    if (!pedido) return;
    setError("");
    setCancelando(true);
    try {
      const resultado = await cancelarPedido({
        codigo: pedido.id,
        nombre: datos.nombre,
        correo: datos.correo,
      });
      enviarCorreoPedidoCancelado({
        correo: datos.correo,
        nombre: datos.nombre,
        numeroPedido: resultado.numeroPedido,
      }).catch((err) =>
        console.error("No se pudo enviar el correo de cancelación:", err)
      );
      setPedido((anterior) => ({
        ...anterior,
        estado: "cancelado",
        puedeCancelarse: false,
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo cancelar el pedido.");
    } finally {
      setCancelando(false);
    }
  }

  function manejarNuevaConsulta() {
    setPedido(null);
    setError("");
    setDatos(DATOS_INICIALES);
  }

  return (
    <div className="pagina-gestionar-wrap">
      <header className="barra-superior">
        <Link to="/" className="marca">SCILD</Link>
        <MenuGestion />
      </header>

      <main className="pagina-gestionar entrada">
        {!pedido ? (
          <>
            <h1>Gestionar un pedido</h1>
            <p className="instrucciones">
              Escribe el nombre y correo con los que hiciste el pedido, junto
              con el código que te mostramos al hacerlo, para ver en qué va.
            </p>

            <form className="formulario-gestionar" onSubmit={manejarConsulta}>
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
                Código del pedido
                <input
                  type="text"
                  value={datos.codigo}
                  onChange={(e) => actualizarCampo("codigo", e.target.value)}
                  required
                />
              </label>

              {error && <p className="mensaje-error">{error}</p>}

              <button type="submit" disabled={consultando}>
                {consultando ? "Consultando..." : "Consultar pedido"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Pedido #{pedido.numeroPedido}</h1>

            <div className={`tarjeta-estado estado-${pedido.estado}`}>
              <span className="tarjeta-estado-etiqueta">
                {ETIQUETAS_ESTADO[pedido.estado] ?? pedido.estado}
              </span>

              <dl className="tarjeta-estado-datos">
                <div>
                  <dt>Versión</dt>
                  <dd>{pedido.versionNombre}</dd>
                </div>
                <div>
                  <dt>Nombre</dt>
                  <dd>{pedido.nombre}</dd>
                </div>
                <div>
                  <dt>Domicilio</dt>
                  <dd>{pedido.domicilio}</dd>
                </div>
                {pedido.estado === "confirmado" && pedido.cancelableHasta && (
                  <div>
                    <dt>Cancelable hasta</dt>
                    <dd>{formatearFecha(pedido.cancelableHasta)}</dd>
                  </div>
                )}
              </dl>
            </div>

            {error && <p className="mensaje-error">{error}</p>}

            {pedido.puedeCancelarse && (
              <button
                type="button"
                className="boton-cancelar"
                onClick={manejarCancelacion}
                disabled={cancelando}
              >
                {cancelando ? "Cancelando..." : "Cancelar este pedido"}
              </button>
            )}

            <p className="enlace-volver">
              <button type="button" className="boton-enlace" onClick={manejarNuevaConsulta}>
                Consultar otro pedido
              </button>
              {" · "}
              <Link to="/">Volver al inicio</Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}

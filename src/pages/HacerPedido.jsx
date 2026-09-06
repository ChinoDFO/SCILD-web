// src/pages/HacerPedido.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos } from "../services/productos";
import { crearPedido } from "../services/pedidos";
import { enviarCorreoNuevoPedidoAdmin } from "../services/notificaciones";
import ResumenPedido from "../components/ResumenPedido";
import "./HacerPedido.css";

const DATOS_INICIALES = {
  nombre: "",
  correo: "",
  telefono: "",
  domicilio: "",
  indicaciones: "",
  versionId: "",
};

export default function HacerPedido() {
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [pedidoCreado, setPedidoCreado] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  function cargarProductos() {
    setCargandoProductos(true);
    listarProductos()
      .then(setProductos)
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el catálogo de versiones.");
      })
      .finally(() => setCargandoProductos(false));
  }

  function actualizarCampo(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");

    if (!datos.versionId) {
      setError("Elige una versión del botón.");
      return;
    }

    setEnviando(true);
    try {
      const pedido = await crearPedido(datos);
      enviarCorreoNuevoPedidoAdmin(pedido).catch((err) =>
        console.error("No se pudo avisar al administrador por correo:", err)
      );
      setPedidoCreado(pedido);
    } catch (err) {
      console.error(err);
      setError(
        err.message === "Esa versión ya no tiene stock disponible."
          ? "Justo se acabó el stock de esa versión. Elige otra, por favor."
          : "No se pudo registrar el pedido. Inténtalo de nuevo."
      );
      cargarProductos(); // por si el stock cambió mientras tanto
    } finally {
      setEnviando(false);
    }
  }

  if (pedidoCreado) {
    return <ResumenPedido pedido={pedidoCreado} />;
  }

  return (
    <main className="pagina-pedido">
      <h1>Pide tu botón SCILD</h1>

      <form className="formulario-pedido" onSubmit={manejarEnvio}>
        <fieldset>
          <legend>Elige la versión</legend>

          {cargandoProductos && <p>Cargando versiones disponibles...</p>}

          {!cargandoProductos &&
            productos.map((producto) => {
              const agotado = (producto.stockDisponible ?? 0) <= 0;
              return (
                <label
                  key={producto.id}
                  className={`opcion-version ${agotado ? "agotado" : ""}`}
                >
                  <input
                    type="radio"
                    name="versionId"
                    value={producto.id}
                    disabled={agotado}
                    checked={datos.versionId === producto.id}
                    onChange={(e) =>
                      actualizarCampo("versionId", e.target.value)
                    }
                    required
                  />
                  <span>
                    {producto.nombre}{" "}
                    {agotado
                      ? "— agotado"
                      : `— ${producto.stockDisponible} disponibles`}
                  </span>
                </label>
              );
            })}
        </fieldset>

        <label>
          Nombre completo
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => actualizarCampo("nombre", e.target.value)}
            required
          />
        </label>

        <label>
          Correo
          <input
            type="email"
            value={datos.correo}
            onChange={(e) => actualizarCampo("correo", e.target.value)}
            required
          />
        </label>

        <label>
          Teléfono
          <input
            type="tel"
            value={datos.telefono}
            onChange={(e) => actualizarCampo("telefono", e.target.value)}
            required
          />
        </label>

        <label>
          Domicilio
          <input
            type="text"
            value={datos.domicilio}
            onChange={(e) => actualizarCampo("domicilio", e.target.value)}
            required
          />
        </label>

        <label>
          Indicaciones para el repartidor (opcional)
          <textarea
            value={datos.indicaciones}
            onChange={(e) => actualizarCampo("indicaciones", e.target.value)}
            rows={3}
          />
        </label>

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Hacer pedido"}
        </button>
      </form>

      <p className="enlace-admin">
        <Link to="/cancelar">¿Necesitas cancelar un pedido?</Link>
        {" · "}
        <Link to="/admin/login">Entrar como administrador</Link>
      </p>
    </main>
  );
}
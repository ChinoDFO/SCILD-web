// src/components/TarjetaPedido.jsx

import { useState } from "react";
import {
  formatearFecha,
  valorPorDefectoDatetimeLocal,
} from "../utils/fechas";
import "./TarjetaPedido.css";

const ETIQUETAS_ESTADO = {
  pendiente: { texto: "Pendiente", clase: "estado-pendiente" },
  confirmado: { texto: "Confirmado", clase: "estado-confirmado" },
  entregado: { texto: "Entregado", clase: "estado-entregado" },
  cancelado: { texto: "Cancelado", clase: "estado-cancelado" },
};

export default function TarjetaPedido({
  pedido,
  alConfirmar,
  alMarcarEntregado,
  alEliminar,
}) {
  const [fechaLimite, setFechaLimite] = useState(
    valorPorDefectoDatetimeLocal(24)
  );
  const [procesando, setProcesando] = useState(false);

  const estadoInfo = ETIQUETAS_ESTADO[pedido.estado] ?? {
    texto: pedido.estado,
    clase: "",
  };

  async function manejarConfirmar() {
    setProcesando(true);
    try {
      await alConfirmar(pedido.id, new Date(fechaLimite));
    } finally {
      setProcesando(false);
    }
  }

  async function manejarEntregado() {
    setProcesando(true);
    try {
      await alMarcarEntregado(pedido.id);
    } finally {
      setProcesando(false);
    }
  }

  async function manejarEliminar() {
    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar el pedido #${pedido.numeroPedido ?? pedido.id}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;
    setProcesando(true);
    try {
      await alEliminar(pedido.id);
    } finally {
      setProcesando(false);
    }
  }

  return (
    <article className={`tarjeta-pedido ${estadoInfo.clase}`}>
      <header className="tarjeta-pedido-cabecera">
        <h3>Pedido #{pedido.numeroPedido ?? "—"}</h3>
        <span className={`etiqueta-estado ${estadoInfo.clase}`}>
          {estadoInfo.texto}
        </span>
      </header>

      <dl className="tarjeta-pedido-datos">
        <dt>Cliente</dt>
        <dd>{pedido.nombre}</dd>

        <dt>Correo</dt>
        <dd>{pedido.correo}</dd>

        <dt>Teléfono</dt>
        <dd>{pedido.telefono}</dd>

        <dt>Domicilio</dt>
        <dd>{pedido.domicilio}</dd>

        {pedido.indicaciones && (
          <>
            <dt>Indicaciones</dt>
            <dd>{pedido.indicaciones}</dd>
          </>
        )}

        <dt>Versión</dt>
        <dd>{pedido.versionNombre}</dd>

        <dt>Código de entrega</dt>
        <dd>{pedido.codigoEntrega}</dd>

        <dt>Hecho el</dt>
        <dd>{formatearFecha(pedido.creadoEn)}</dd>

        {pedido.confirmadoEn && (
          <>
            <dt>Confirmado el</dt>
            <dd>{formatearFecha(pedido.confirmadoEn)}</dd>
          </>
        )}

        {pedido.cancelableHasta && pedido.estado === "confirmado" && (
          <>
            <dt>Cancelable hasta</dt>
            <dd>{formatearFecha(pedido.cancelableHasta)}</dd>
          </>
        )}

        {pedido.entregadoEn && (
          <>
            <dt>Entregado el</dt>
            <dd>{formatearFecha(pedido.entregadoEn)}</dd>
          </>
        )}

        {pedido.canceladoEn && (
          <>
            <dt>Cancelado el</dt>
            <dd>{formatearFecha(pedido.canceladoEn)}</dd>
          </>
        )}
      </dl>

      <div className="tarjeta-pedido-acciones">
        {pedido.estado === "pendiente" && (
          <div className="accion-confirmar">
            <label>
              Cancelable hasta:
              <input
                type="datetime-local"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
              />
            </label>
            <button
              type="button"
              disabled={procesando}
              onClick={manejarConfirmar}
            >
              Confirmar pedido
            </button>
          </div>
        )}

        {pedido.estado === "confirmado" && (
          <button
            type="button"
            disabled={procesando}
            onClick={manejarEntregado}
          >
            Marcar como entregado
          </button>
        )}

        <button
          type="button"
          className="boton-peligro"
          disabled={procesando}
          onClick={manejarEliminar}
        >
          Eliminar pedido
        </button>
      </div>
    </article>
  );
}

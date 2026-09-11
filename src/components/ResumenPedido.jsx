import { formatearFecha } from "../utils/fechas";
import "./ResumenPedido.css";

function CampoCodigo({ etiqueta, valor, explicacion }) {
  async function copiar() {
    try {
      await navigator.clipboard.writeText(String(valor));
    } catch {
      // Si el navegador no permite copiar, el cliente igual puede
      // seleccionar y copiar el texto a mano.
    }
  }

  return (
    <div className="campo-codigo">
      <span className="campo-codigo-etiqueta">{etiqueta}</span>
      <div className="campo-codigo-valor">
        <code>{valor}</code>
        <button type="button" onClick={copiar}>Copiar</button>
      </div>
      <p className="campo-codigo-explicacion">{explicacion}</p>
    </div>
  );
}

export default function ResumenPedido({ pedido }) {
  return (
    <div className="resumen-pedido entrada">
      <h2>¡Tu pedido fue registrado!</h2>
      <p className="resumen-pedido-numero">Pedido #{pedido.numeroPedido}</p>

      <div className="resumen-pedido-aviso">
        Guarda esta pantalla o tómale una captura antes de salir de aquí.
        No vas a poder volver a verla después.
      </div>

      <section className="resumen-pedido-datos">
        <h3>Datos del pedido</h3>
        <dl>
          <dt>Nombre</dt><dd>{pedido.nombre}</dd>
          <dt>Correo</dt><dd>{pedido.correo}</dd>
          <dt>Teléfono</dt><dd>{pedido.telefono}</dd>
          <dt>Domicilio</dt><dd>{pedido.domicilio}</dd>
          {pedido.indicaciones && (<><dt>Indicaciones</dt><dd>{pedido.indicaciones}</dd></>)}
          <dt>Versión</dt><dd>{pedido.versionNombre}</dd>
          <dt>Hecho el</dt><dd>{formatearFecha(pedido.creadoEn)}</dd>
        </dl>
      </section>

      <section className="resumen-pedido-codigos">
        <CampoCodigo
          etiqueta="Código de cancelación"
          valor={pedido.id}
          explicacion="Úsalo junto con tu nombre y correo si necesitas cancelar el pedido."
        />
        <CampoCodigo
          etiqueta="Código de entrega"
          valor={pedido.codigoEntrega}
          explicacion="Dáselo al repartidor cuando llegue, para confirmar que el pedido es tuyo."
        />
      </section>
    </div>
  );
}
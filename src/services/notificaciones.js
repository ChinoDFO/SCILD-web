import emailjs from "@emailjs/browser";
import { CORREO_ADMIN } from "../config/contacto";
import { formatearFecha } from "../utils/fechas";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PLANTILLA_NUEVO_PEDIDO = import.meta.env.VITE_EMAILJS_PLANTILLA_NUEVO_PEDIDO;
const PLANTILLA_CONFIRMADO = import.meta.env.VITE_EMAILJS_PLANTILLA_CONFIRMADO;
const PLANTILLA_CANCELADO = import.meta.env.VITE_EMAILJS_PLANTILLA_CANCELADO;

export function enviarCorreoNuevoPedidoAdmin(pedido) {
  return emailjs.send(SERVICE_ID, PLANTILLA_NUEVO_PEDIDO, {
    to_email: CORREO_ADMIN,
    numero_pedido: pedido.numeroPedido,
    nombre: pedido.nombre,
    correo: pedido.correo,
    telefono: pedido.telefono,
    domicilio: pedido.domicilio,
    indicaciones: pedido.indicaciones || "(sin indicaciones)",
    version: pedido.versionNombre,
    codigo_entrega: pedido.codigoEntrega,
  });
}

export function enviarCorreoPedidoConfirmado({ correo, nombre, numeroPedido, versionNombre, cancelableHasta }) {
  return emailjs.send(SERVICE_ID, PLANTILLA_CONFIRMADO, {
    to_email: correo,
    nombre,
    numero_pedido: numeroPedido,
    version: versionNombre,
    cancelable_hasta: formatearFecha(cancelableHasta),
  });
}

export function enviarCorreoPedidoCancelado({ correo, nombre, numeroPedido }) {
  return emailjs.send(SERVICE_ID, PLANTILLA_CANCELADO, {
    to_email: correo,
    nombre,
    numero_pedido: numeroPedido,
  });
}
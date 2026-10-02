// src/services/notificaciones.js
//
// Los correos ya no se mandan desde el navegador: aquí solo se le avisa al
// backend (scild-backend) "este pedido pasó a tal estado" y él se encarga de
// buscar el pedido, armar el correo y mandarlo desde Gmail. Por eso solo se
// envía el código del pedido, nunca destinatario ni contenido.

const API_URL = import.meta.env.VITE_API_URL;

async function avisarAlBackend(pedidoId, tipo) {
  if (!API_URL) {
    throw new Error("Falta VITE_API_URL en el .env: no se puede avisar al backend");
  }

  const respuesta = await fetch(`${API_URL}/api/correos/pedido`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pedidoId, tipo }),
  });

  if (!respuesta.ok) {
    const { error } = await respuesta.json().catch(() => ({}));
    throw new Error(error || `El backend respondió ${respuesta.status}`);
  }
}

export function enviarCorreoNuevoPedidoAdmin(pedido) {
  return avisarAlBackend(pedido.id, "nuevo");
}

export function enviarCorreoPedidoConfirmado(pedidoId) {
  return avisarAlBackend(pedidoId, "confirmado");
}

export function enviarCorreoPedidoCancelado(pedidoId) {
  return avisarAlBackend(pedidoId, "cancelado");
}

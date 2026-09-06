// src/services/pedidos.js
//
// Funciones para que el panel de administrador lea los pedidos en tiempo
// real y pueda confirmarlos, marcarlos como entregados o eliminarlos.
// Todas requieren que quien las llame haya iniciado sesión como
// administrador (lo exigen las reglas de seguridad de Firestore).

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  generarCodigoAlfanumerico,
  generarCodigoEntrega,
} from "../utils/codigos";


const coleccionPedidos = collection(db, "Pedidos");

/**
 * Escucha los pedidos en tiempo real (se actualiza solo, sin recargar).
 * @param {(pedidos: Array) => void} alCambiar - se llama cada vez que hay cambios
 * @param {(error: Error) => void} alFallar - se llama si algo falla (ej. sin permiso)
 * @returns {() => void} función para dejar de escuchar
 */
export function escucharPedidos(alCambiar, alFallar) {
  const consulta = query(coleccionPedidos, orderBy("creadoEn", "desc"));

  return onSnapshot(
    consulta,
    (snapshot) => {
      const pedidos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      alCambiar(pedidos);
    },
    (error) => {
      console.error("Error al escuchar pedidos:", error);
      if (alFallar) alFallar(error);
    }
  );
}

/**
 * Confirma un pedido: pasa a estado "confirmado" y define hasta cuándo
 * se puede cancelar (el administrador elige la fecha/hora límite).
 * @param {string} pedidoId
 * @param {Date} fechaLimiteCancelacion
 */
export async function confirmarPedido(pedidoId, fechaLimiteCancelacion) {
  const referencia = doc(db, "Pedidos", pedidoId);
  await updateDoc(referencia, {
    estado: "confirmado",
    confirmadoEn: serverTimestamp(),
    cancelableHasta: Timestamp.fromDate(fechaLimiteCancelacion),
  });
}

/**
 * Marca un pedido como entregado.
 * Temporal: por ahora lo hace el propio administrador manualmente,
 * hasta que exista una vista especial para repartidores.
 * @param {string} pedidoId
 */
export async function marcarComoEntregado(pedidoId) {
  const referencia = doc(db, "Pedidos", pedidoId);
  await updateDoc(referencia, {
    estado: "entregado",
    entregadoEn: serverTimestamp(),
  });
}

/**
 * Elimina un pedido por completo (irreversible).
 * @param {string} pedidoId
 */
export async function eliminarPedido(pedidoId) {
  const referencia = doc(db, "Pedidos", pedidoId);
  await deleteDoc(referencia);
}

export async function cancelarPedido({ codigo, nombre, correo }) {
  const referenciaPedido = doc(db, "Pedidos", codigo.trim());

  await runTransaction(db, async (transaccion) => {
    const pedidoSnap = await transaccion.get(referenciaPedido);
    if (!pedidoSnap.exists()) {
      throw new Error("No encontramos ningún pedido con ese código.");
    }

    const pedido = pedidoSnap.data();

    if (pedido.nombre !== nombre.trim() || pedido.correo !== correo.trim()) {
      throw new Error("El nombre o el correo no coinciden con este pedido.");
    }

    if (pedido.estado === "cancelado") {
      throw new Error("Este pedido ya estaba cancelado.");
    }
    if (pedido.estado === "entregado") {
      throw new Error("Este pedido ya fue entregado, ya no se puede cancelar.");
    }
    if (pedido.estado === "confirmado") {
      const limite = pedido.cancelableHasta?.toDate?.();
      if (!limite || new Date() > limite) {
        throw new Error("El plazo para cancelar este pedido ya pasó.");
      }
    }
    // Si estado === "pendiente", siempre se puede cancelar, sin límite de tiempo.

    const referenciaProducto = doc(db, "Productos", pedido.versionId);
    const productoSnap = await transaccion.get(referenciaProducto);
    if (!productoSnap.exists()) {
      throw new Error("No se pudo reponer el stock: la versión ya no existe.");
    }
    const stockActual = productoSnap.data().stockDisponible ?? 0;

    transaccion.update(referenciaPedido, {
      estado: "cancelado",
      canceladoEn: serverTimestamp(),
      stockRepuesto: true,
      nombre: pedido.nombre,
      correo: pedido.correo,
    });

    transaccion.update(referenciaProducto, {
      stockDisponible: stockActual + 1,
      ultimaCancelacionId: codigo.trim(),
    });
  });
}

/**
 * Crea un pedido nuevo: genera sus dos códigos, descuenta 1 unidad de
 * stock de la versión elegida y avanza el número de pedido consecutivo.
 * Las tres cosas pasan juntas en una transacción — o se hacen las tres,
 * o no se hace ninguna (por ejemplo, si el stock ya se acabó).
 */
export async function crearPedido(datosFormulario) {
  const { nombre, correo, telefono, domicilio, indicaciones, versionId } =
    datosFormulario;

  const idPedido = generarCodigoAlfanumerico(10);
  const codigoEntrega = generarCodigoEntrega();

  const referenciaPedido = doc(db, "Pedidos", idPedido);
  const referenciaProducto = doc(db, "Productos", versionId);
  const referenciaContador = doc(db, "Contadores", "pedidos");

  let numeroPedidoAsignado;
  let versionNombre;

  await runTransaction(db, async (transaccion) => {
    const productoSnap = await transaccion.get(referenciaProducto);
    if (!productoSnap.exists()) {
      throw new Error("La versión seleccionada ya no existe.");
    }

    const stockActual = productoSnap.data().stockDisponible ?? 0;
    if (stockActual <= 0) {
      throw new Error("Esa versión ya no tiene stock disponible.");
    }

    const contadorSnap = await transaccion.get(referenciaContador);
    if (!contadorSnap.exists()) {
      throw new Error(
        "Falta configurar el contador de pedidos (Contadores/pedidos) en Firestore."
      );
    }

    const ultimoNumero = contadorSnap.data().ultimoNumero ?? 0;
    numeroPedidoAsignado = ultimoNumero + 1;
    versionNombre = productoSnap.data().nombre;

    transaccion.set(referenciaPedido, {
      nombre,
      correo,
      telefono,
      domicilio,
      indicaciones,
      versionId,
      versionNombre,
      numeroPedido: numeroPedidoAsignado,
      codigoEntrega,
      estado: "pendiente",
      stockRepuesto: false,
      creadoEn: serverTimestamp(),
    });

    transaccion.update(referenciaProducto, { stockDisponible: stockActual - 1 });
    transaccion.update(referenciaContador, { ultimoNumero: numeroPedidoAsignado });
  });



  return {
    id: idPedido,
    nombre,
    correo,
    telefono,
    domicilio,
    indicaciones,
    versionNombre,
    numeroPedido: numeroPedidoAsignado,
    codigoEntrega,
    creadoEn: new Date(), // solo para mostrarlo de inmediato; el real se guarda en el servidor
  };
}

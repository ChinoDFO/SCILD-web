// src/services/productos.js
//
// Funciones para leer la colección "Productos" (las 3 versiones del botón
// y su stock). La lectura es pública según las reglas de seguridad, así que
// esta función sirve, entre otras cosas, para comprobar que la conexión a
// Firestore funciona correctamente.

import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Trae todos los documentos de la colección Productos.
 * @returns {Promise<Array<{id: string, nombre: string, stockDisponible: number, orden?: number}>>}
 */
export async function listarProductos() {
  const referenciaColeccion = collection(db, "Productos");
  const snapshot = await getDocs(referenciaColeccion);

  const productos = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Si definiste el campo "orden", los dejamos ordenados así.
  productos.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  return productos;
}

/**
 * Escucha la colección Productos en tiempo real (para el panel de
 * administrador: si alguien hace un pedido o lo cancela, el stock que se ve
 * en pantalla se actualiza solo).
 *
 * @param {(productos: Array) => void} alCambiar
 * @param {(error: Error) => void} [alFallar]
 * @returns {() => void} función para dejar de escuchar
 */
export function escucharProductos(alCambiar, alFallar) {
  return onSnapshot(
    collection(db, "Productos"),
    (snapshot) => {
      const productos = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));
      productos.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
      alCambiar(productos);
    },
    (error) => {
      console.error("Error al escuchar productos:", error);
      if (alFallar) alFallar(error);
    }
  );
}

/**
 * Fija el stock de una versión a un número exacto.
 * Solo funciona con sesión de administrador (lo exigen las reglas de
 * seguridad: en Productos, un update libre requiere esAdmin()).
 *
 * @param {string} productoId
 * @param {number} nuevoStock entero >= 0
 */
export async function fijarStock(productoId, nuevoStock) {
  const stock = Number(nuevoStock);
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("El stock tiene que ser un número entero de 0 en adelante.");
  }
  await updateDoc(doc(db, "Productos", productoId), {
    stockDisponible: stock,
  });
}

/**
 * Suma (o resta, con cantidad negativa) al stock actual de una versión.
 * Usa una transacción para no pisar un cambio hecho al mismo tiempo por un
 * pedido o una cancelación. Nunca deja el stock por debajo de 0.
 *
 * @param {string} productoId
 * @param {number} cantidad p. ej. 1 o -1
 * @returns {Promise<number>} el stock que quedó
 */
export async function ajustarStock(productoId, cantidad) {
  const referencia = doc(db, "Productos", productoId);

  return runTransaction(db, async (transaccion) => {
    const snap = await transaccion.get(referencia);
    if (!snap.exists()) {
      throw new Error("Esa versión ya no existe.");
    }

    const stockActual = snap.data().stockDisponible ?? 0;
    const nuevoStock = stockActual + cantidad;
    if (nuevoStock < 0) {
      throw new Error("El stock no puede quedar en negativo.");
    }

    transaccion.update(referencia, { stockDisponible: nuevoStock });
    return nuevoStock;
  });
}

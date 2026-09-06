// src/services/productos.js
//
// Funciones para leer la colección "Productos" (las 3 versiones del botón
// y su stock). La lectura es pública según las reglas de seguridad, así que
// esta función sirve, entre otras cosas, para comprobar que la conexión a
// Firestore funciona correctamente.

import { collection, getDocs } from "firebase/firestore";
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

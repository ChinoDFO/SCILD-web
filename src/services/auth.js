// src/services/auth.js
//
// Funciones de autenticación para el administrador.
// Usa Firebase Auth con correo y contraseña, tal como se definió en el
// diseño de la base de datos (el UID que genera esto debe coincidir con
// el ID del documento en la colección "Administrador").

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";

/**
 * Inicia sesión como administrador.
 * @param {string} correo
 * @param {string} password
 */
export async function iniciarSesionAdmin(correo, password) {
  const credencial = await signInWithEmailAndPassword(auth, correo, password);
  return credencial.user;
}

export async function cerrarSesionAdmin() {
  await signOut(auth);
}

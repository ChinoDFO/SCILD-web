// src/config/rutas.js
//
// Ruta secreta de administración.
//
// El panel de administrador YA NO se anuncia con ningún botón ni enlace en
// la página pública: se entra escribiendo la ruta directamente en el
// navegador. Eso quita un botón que el cliente nunca va a usar y deja el
// acceso menos a la vista.
//
// Si quieres cambiar la ruta (por ejemplo, si alguien más la llegó a ver),
// define VITE_RUTA_ADMIN en el archivo .env con otro valor, sin la barra
// inicial. Ejemplo:  VITE_RUTA_ADMIN=oficina-7h3k
//
// OJO: esto es solo "seguridad por discreción". La protección real de los
// datos la siguen haciendo Firebase Auth y las reglas de seguridad de
// Firestore: aunque alguien adivine la ruta, sin sesión de administrador
// no puede leer ni escribir nada.

const BASE = import.meta.env.VITE_RUTA_ADMIN || "acceso-scild-9k2x";

/** Página de inicio de sesión del administrador. */
export const RUTA_ADMIN_LOGIN = `/${BASE}`;

/** Panel de administrador (pedidos y stock). */
export const RUTA_ADMIN_PANEL = `/${BASE}/panel`;

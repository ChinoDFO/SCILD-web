// src/firebase/config.js
//
// Este archivo inicializa la conexión con Firebase una sola vez,
// y exporta las instancias (db, auth) que va a usar el resto de la app.
//
// Las llaves reales NUNCA van escritas aquí directamente: se leen desde
// variables de entorno (archivo .env en la raíz del proyecto, que NO se sube
// a git). Ver .env.example para saber qué variables hacen falta.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Aviso temprano y claro si a alguien se le olvidó llenar el .env,
// en vez de dejar que falle más adelante con un error confuso de Firebase.
const camposFaltantes = Object.entries(firebaseConfig).filter(
  ([, valor]) => !valor
);
if (camposFaltantes.length > 0) {
  console.error(
    "Falta configuración de Firebase. Revisa tu archivo .env — " +
      "faltan estas variables: " +
      camposFaltantes.map(([llave]) => llave).join(", ")
  );
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

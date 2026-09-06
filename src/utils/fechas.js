// src/utils/fechas.js

/**
 * Convierte un Timestamp de Firestore (o null/undefined) a texto legible.
 * @param {import("firebase/firestore").Timestamp | null | undefined} timestamp
 */
export function formatearFecha(valor) {
  if (!valor) return "—";
  const fecha = typeof valor.toDate === "function" ? valor.toDate() : valor;
  return fecha.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
/**
 * Da el valor por defecto para un <input type="datetime-local">,
 * "horasDesdeAhora" horas a partir de este momento.
 * @param {number} horasDesdeAhora
 */
export function valorPorDefectoDatetimeLocal(horasDesdeAhora = 24) {
  const fecha = new Date(Date.now() + horasDesdeAhora * 60 * 60 * 1000);
  const desplazamientoMin = fecha.getTimezoneOffset();
  const fechaLocal = new Date(fecha.getTime() - desplazamientoMin * 60 * 1000);
  return fechaLocal.toISOString().slice(0, 16); // "AAAA-MM-DDTHH:mm"
}

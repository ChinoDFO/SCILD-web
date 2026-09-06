// src/utils/codigos.js
//
// Generadores de los dos códigos especiales de cada pedido:
// - Código de cancelación: será el ID del documento en Firestore.
// - Código de entrega: número corto que el cliente le dice al repartidor.
//
// Usan crypto.getRandomValues (aleatoriedad segura del navegador),
// no Math.random(), porque este código además funciona como llave de
// seguridad para poder cancelar el pedido más adelante.

const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
// Nota: se excluyen 0/O y 1/l/I a propósito, para que si el cliente
// tiene que copiar el código a mano no se confunda entre letras/números.

export function generarCodigoAlfanumerico(longitud = 10) {
  const valoresAleatorios = new Uint32Array(longitud);
  crypto.getRandomValues(valoresAleatorios);
  let codigo = "";
  for (let i = 0; i < longitud; i++) {
    codigo += CARACTERES[valoresAleatorios[i] % CARACTERES.length];
  }
  return codigo;
}

export function generarCodigoEntrega() {
  const valorAleatorio = new Uint32Array(1);
  crypto.getRandomValues(valorAleatorio);
  return 100000 + (valorAleatorio[0] % 900000);
}
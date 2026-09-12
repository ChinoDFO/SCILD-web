import { useEffect, useState } from "react";
import { listarProductos } from "../services/productos";
import "./Inicio.css";

function Inicio() {
  const [estado, setEstado] = useState("cargando"); // "cargando" | "ok" | "error"
  const [productos, setProductos] = useState([]);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarProductos()
      .then((datos) => {
        setProductos(datos);
        setEstado("ok");
      })
      .catch((error) => {
        console.error(error);
        setMensajeError(error.message);
        setEstado("error");
      });
  }, []);

  return (
    <main className="prueba-conexion">
      <h1>SCILD — prueba de conexión a Firestore</h1>
      <p className="nota-temporal">
        Esta página es temporal, solo para confirmar la conexión. Se
        reemplaza por la tienda real en el paso 3.
      </p>

      {estado === "cargando" && <p>Conectando con la base de datos...</p>}

      {estado === "error" && (
        <div className="aviso aviso-error">
          <p>
            No se pudo conectar con Firestore. Revisa que tu archivo{" "}
            <code>.env</code> tenga las variables correctas (copia{" "}
            <code>.env.example</code> como <code>.env</code> y llénalo con
            los datos de tu proyecto de Firebase).
          </p>
          <p>Detalle técnico: {mensajeError}</p>
        </div>
      )}

      {estado === "ok" && (
        <div className="aviso aviso-ok">
          <p>
            Conexión exitosa. Se encontraron {productos.length} producto(s)
            en la colección "Productos":
          </p>
          {productos.length === 0 ? (
            <p>
              La colección existe pero está vacía — recuerda crear a mano
              los 3 documentos de versiones del botón en la consola de
              Firestore.
            </p>
          ) : (
            <ul>
              {productos.map((producto) => (
                <li key={producto.id}>
                  <strong>{producto.nombre ?? producto.id}</strong> — stock:{" "}
                  {producto.stockDisponible ?? "sin definir"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

    </main>
  );
}

export default Inicio;

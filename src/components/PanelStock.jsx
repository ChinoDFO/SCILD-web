// src/components/PanelStock.jsx
//
// Bloque del panel de administrador que muestra el stock de cada versión
// del botón y permite modificarlo: con los botones -1 / +1 (rápido) o
// escribiendo un número exacto y guardando.
//
// El stock se escucha en tiempo real, así que si entra un pedido nuevo o
// alguien cancela, el número de aquí cambia solo.

import { useEffect, useState } from "react";
import { escucharProductos, ajustarStock, fijarStock } from "../services/productos";
import "./PanelStock.css";

export default function PanelStock() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Valores que el administrador está escribiendo, por producto:
  // { [productoId]: "12" }. Si no hay nada escrito, se muestra el stock real.
  const [borradores, setBorradores] = useState({});
  // Producto que está guardando ahora mismo (para deshabilitar sus botones).
  const [ocupado, setOcupado] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const dejarDeEscuchar = escucharProductos(
      (datos) => {
        setProductos(datos);
        setCargando(false);
      },
      (err) => {
        console.error(err);
        setError("No se pudo cargar el stock.");
        setCargando(false);
      }
    );
    return dejarDeEscuchar;
  }, []);

  async function conManejoDeError(productoId, accion, mensajeExito) {
    setError("");
    setAviso("");
    setOcupado(productoId);
    try {
      await accion();
      setAviso(mensajeExito);
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo actualizar el stock.");
      return false;
    } finally {
      setOcupado("");
    }
  }

  // Quita lo que el administrador tuviera escrito en el campo de ese
  // producto, para que vuelva a mostrar el stock real.
  function limpiarBorrador(productoId) {
    setBorradores((previos) => {
      const copia = { ...previos };
      delete copia[productoId];
      return copia;
    });
  }

  async function manejarAjuste(producto, cantidad) {
    const listo = await conManejoDeError(
      producto.id,
      () => ajustarStock(producto.id, cantidad),
      `Stock de "${producto.nombre ?? producto.id}" actualizado.`
    );
    // Al ajustar con los botones se descarta lo que estuviera escrito,
    // para que el campo vuelva a reflejar el stock real.
    if (listo) limpiarBorrador(producto.id);
  }

  async function manejarGuardar(evento, producto) {
    evento.preventDefault();
    const escrito = borradores[producto.id];
    if (escrito === undefined || escrito === "") return;

    const valor = Number(escrito);
    if (!Number.isInteger(valor) || valor < 0) {
      setError("El stock tiene que ser un número entero de 0 en adelante.");
      return;
    }

    const listo = await conManejoDeError(
      producto.id,
      () => fijarStock(producto.id, valor),
      `Stock de "${producto.nombre ?? producto.id}" fijado en ${valor}.`
    );
    if (listo) limpiarBorrador(producto.id);
  }

  return (
    <section className="panel-stock">
      <div className="panel-stock-cabecera">
        <h2>Stock</h2>
        <p>
          Unidades disponibles de cada versión. Se descuenta solo al hacer un
          pedido y se repone al cancelarlo.
        </p>
      </div>

      {cargando && <p>Cargando stock...</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {aviso && !error && <p className="mensaje-ok">{aviso}</p>}

      {!cargando && productos.length === 0 && (
        <p>No hay versiones registradas en la colección Productos.</p>
      )}

      <div className="lista-stock">
        {productos.map((producto) => {
          const stock = producto.stockDisponible ?? 0;
          const valorCampo = borradores[producto.id] ?? String(stock);
          const estaOcupado = ocupado === producto.id;
          const hayCambio = valorCampo !== String(stock);

          return (
            <article key={producto.id} className="tarjeta-stock">
              <div className="tarjeta-stock-info">
                <h3>{producto.nombre ?? producto.id}</h3>
                <p
                  className={
                    stock === 0 ? "stock-numero stock-agotado" : "stock-numero"
                  }
                >
                  {stock}
                  <span> {stock === 1 ? "unidad" : "unidades"}</span>
                </p>
                {stock === 0 && <p className="stock-aviso">Agotado</p>}
              </div>

              <div className="tarjeta-stock-acciones">
                <div className="stock-rapido">
                  <button
                    type="button"
                    onClick={() => manejarAjuste(producto, -1)}
                    disabled={estaOcupado || stock === 0}
                    aria-label={`Quitar una unidad a ${producto.nombre ?? producto.id}`}
                  >
                    −1
                  </button>
                  <button
                    type="button"
                    onClick={() => manejarAjuste(producto, 1)}
                    disabled={estaOcupado}
                    aria-label={`Agregar una unidad a ${producto.nombre ?? producto.id}`}
                  >
                    +1
                  </button>
                </div>

                <form
                  className="stock-exacto"
                  onSubmit={(evento) => manejarGuardar(evento, producto)}
                >
                  <label htmlFor={`stock-${producto.id}`}>Fijar en</label>
                  <input
                    id={`stock-${producto.id}`}
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={valorCampo}
                    disabled={estaOcupado}
                    onChange={(evento) =>
                      setBorradores((previos) => ({
                        ...previos,
                        [producto.id]: evento.target.value,
                      }))
                    }
                  />
                  <button type="submit" disabled={estaOcupado || !hayCambio}>
                    {estaOcupado ? "..." : "Guardar"}
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
